import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ai from 'unlimited-ai'
@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  messages: any[] = [];
  addedDescriptions: any[] = [];
  
  model = 'deepseek-v3';

    async initChain(){
      this.messages = [];
      
      this.messages.push({ role: 'user', content: `Whenver I pass a message, I want you to spell and grammar check it to UK standards, and reajust order of statements  to add clarity. Keep the size of a paragraph roughly the same. Do not add anything to your messages other than your fixes` })
      
      
      // try{
      //   let result = (await ai.generate('gpt-4-turbo-2024-04-09', this.messages)); // 'Hello there! How can I be of assistance to you today?'

      // }catch(err){
      //   console.log(err);
      // }
      
    }

    constructor(private http: HttpClient) {}

    async aiFix(message:string){
      
      this.messages.push( { role: 'user', content: `I want you to spell and grammar check it to UK standards, and reajust order of statements  to add clarity. Keep the size of a paragraph roughly the same.  Do not add anything to your messages other than your fixes,  as it will mess with the surrounding program. Give me 3 to 5 veriations (do not add numbers or bulletpoints)` });
      this.messages.push(        { role: 'user', content: `Rewrite & Grammar Check: ${message}` });
      
      return this.runResponse();

    }

    async runResponse(messages?: any){
      
      let functionMessages = this.messages;
      if(messages) functionMessages = messages;
      let result: string;
      result  = (await ai.generate(this.model, functionMessages)).toString();
      if(result.length <= 5){
        console.log("bad response")
        functionMessages.push( { role: 'user', content:`Give me the rewrite`});
        result = await this.runResponse(functionMessages);
      }
      this.messages.push( { role: 'system', content:result});
      return  result
    }
}





