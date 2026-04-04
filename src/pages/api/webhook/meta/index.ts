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

                  // Notificar a +522282455059 
                  fetch('https://api.whatsapp.com/send', {
                     method: 'POST',
                     body: JSON.stringify({
                        phone: '+522282455059',
                        message: 'Hola, te acabo de enviar un mensaje desde mi web'
                     })
                  });
               }
            });
         });
      }

      response.status(200).send('EVENT_RECEIVED');
   } 
   else {
      response.status(405).end();
   }
};
