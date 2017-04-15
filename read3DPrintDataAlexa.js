/*
Matthew Romlewski - April 2017
AWS LAMBDA FUNCTION
Shoutout to Jordan Leigh on YouTube for a great tutorial on Lambda etc., it helped me to learn this all so quickly!
*/ 
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = (event, context) => {
    try{
        if (event.session.new){
            console.log("NEW SESSION")           
        }
            
        switch(event.request.type){

            case "LaunchRequest":
                console.log('LAUNCH REQUEST')
                context.succeed(
                generateResponse(
                    buildSpeechletResponse("welcome to the three D print monitor, I am excited to see its functionality expanded. I Hope you are too!", true),
                    {}
                )
                )
                break;
            
            case "IntentRequest":
                console.log('INTENT REQUEST')
                var 
                switch(event.request.intent.name){

                    case "PrintAllData":
                        
                        break;

                    case "PrintNozTemp":
                        break;
                    
                    case "PrintBedTemp":
                        break;

                    case "PrintTimeLeft":
                        break;
                }
                break;
            
            case "SessionEndedRequest":
                console.log('SESSION ENDED REQUEST')
                break;
            default:
                context.fail('INVALID REQUEST TYPE: ${event.request.type}')
        }
     }catch(error) { context.fail('Exception: ${error}')}
}

buildSpeechletResponse = (outputText, shouldEndSession) => {

    return{
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
}

generateResponse = (speechletResponse, sessionAttributes) => {

    return{
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}

