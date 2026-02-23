import Logger from "@/libs/logger";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
   request: NextApiRequest,
   response: NextApiResponse
){
   const logger = Logger.getInstance();
   
   if (request.method == 'GET') {
      const res = {
         name: "Webhook to OpenPay",
         version: "v0.1"
      }

      response.status(200).json(res)
   } else 
   if (request.method == 'POST') {
      const { body } = request

      logger.info(JSON.stringify(body));
      
      response.status(200).end()
   } 
   else {
      response.status(405).end();
   }
};