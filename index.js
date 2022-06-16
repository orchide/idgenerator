import doublyLinkedList from './doublyLinkedList.js';
import express  from 'express';
import  Redis from 'ioredis';
import { parse, stringify, toJSON, fromJSON } from "flatted";

const app = express();
const redis = new Redis({ port: 6379, host: "10.233.4.168", password: "pcexpass" });



let list =  new doublyLinkedList(0);
list.prepend(-1);


app.get("/", async function (req, res) {
   
    let latestNum = await redis.get('latestNum')

    if(!latestNum) {
      latestNum = await redis.set("latestNum", list.tail.value);
    }

    if(latestNum - list.tail.value > 1) {
        list.append(parseInt(latestNum))
    }


    latestNum = list.append(list.tail.value + 1); 

  console.log(`${Date.now()} \t provided \t exchangeId=${latestNum}`);


    await redis.set("latestNum", latestNum)


   
  res.status(200).json(latestNum);
});

app.listen(2020, console.log('Server running on port 2020...'));