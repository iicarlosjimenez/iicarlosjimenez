import Logger from "@/libs/logger";
import { NextApiRequest, NextApiResponse } from "next";

interface MetaWebhookMessage {
   mid: string;
   text?: string;
   quick_reply?: {
      payload: string;
   };
   attachments?: Array<{
      type: string;
      payload: {
         url: string;
      };
   }>;
}
interface MetaWebhookMessageBusinessAccount {
  from: string;
  id: string;
  timestamp: number;
  text: {
    body: string;
  };
  type: string;
}
interface MetaWebhookMessagingEvent {
   sender: {
      id: string;
   };
   recipient: {
      id: string;
   };
   timestamp: number;
   message?: MetaWebhookMessage;
   postback?: {
      title: string;
      payload: string;
   };
   read?: {
      watermark: number;
   };
   delivery?: {
      mids: string[];
      watermark: number;
   };
}
interface MetaWebhookEntry {
   id: string;
   time: number;
   messaging?: MetaWebhookMessagingEvent[];
   changes?: Array<{
      field: string;
      value: unknown;
   }>;
}
interface MetaWebhookBody {
   object: string;
  entry: MetaWebhookEntry[];
}
interface MetaWebhookChanges {
   messaging_product: string;
   metadata: {
      display_phone_number: string;
      phone_number_id: string;
   };
   contacts: MetaWebhookContact[];
   messages: MetaWebhookMessageBusinessAccount[];
}
interface MetaWebhookContact {
   profile: {
      name: string;
   };
   wa_id: string;
}

export default async function handler(
   request: NextApiRequest,
   response: NextApiResponse
){
   const logger = Logger.getInstance();

   if (request.method == 'GET') {
      const mode = request.query['hub.mode'];
      const token = request.query['hub.verify_token'];
      const challenge = request.query['hub.challenge'];

      const VERIFY_TOKEN  = process.env.WEBHOOK_VERIFY_TOKEN

      if (mode === 'subscribe' && VERIFY_TOKEN == token)
         response.status(200).send(challenge)
      else 
         response.status(403).send('Forbidden');
   } else 
   if (request.method == 'POST') {
      const body = request.body as MetaWebhookBody;

      logger.info(JSON.stringify(body));

      if (body.object === 'page') {
         body.entry?.forEach(entry => {
            entry.messaging?.forEach(event => {
               if (event.message) {
                  console.log('💬 Mensaje de:', event.sender.id);
                  console.log('📝 Texto:', event.message.text);
               }
            });
         });
      }
      if (body.object === 'whatsapp_business_account') {
         for (const entry of body.entry ?? []) {
            for (const change of entry.changes ?? []) {
               if (change.field === 'messages') {

                  const { contacts, messages } = change.value as MetaWebhookChanges;

                  if (!contacts || !messages) continue;

                  const { from, text } = messages[0] as MetaWebhookMessageBusinessAccount;
                  const { name } = contacts[0].profile;
   
                  // Usar la Cloud API de Meta
                  const PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID_KODINC_MX; // ID del número de tu WABA
                  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;       // Token permanente o temporal
                  const MY_NUMBER = '522282455059';
   
                  // Notificar a +522282455059 y comprobar si el mensaje fue enviado por fetch con status 200 o 201
                  const response = await fetch(`https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`, {
                     method: 'POST',
                     headers: {
                        'Authorization': `Bearer ${ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({
                        messaging_product: 'whatsapp',
                        recipient_type: 'individual',
                        to: MY_NUMBER,
                        type: 'text',
                        text: {
                           body: `🔔 Nuevo mensaje en WABA\n\n👤 De: ${name}\n📱 Número: ${from}\n💬 Mensaje: ${text.body}`
                        }
                     })
                  });
   
                  const result = await response.json();
   
                  if (response.ok) {
                     logger.info('✅ Notificación enviada correctamente', result);
                  } else {
                     logger.error('❌ Error al enviar notificación:', result);
                  }
               }
            }
         }
      }

      response.status(200).send('EVENT_RECEIVED');
   } 
   else {
      response.status(405).end();
   }
};
