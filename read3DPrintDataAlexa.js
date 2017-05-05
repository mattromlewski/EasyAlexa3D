/*
Matthew Romlewski - April 2017
AWS LAMBDA FUNCTION
Shoutout to Jordan Leigh on YouTube for a great tutorial on Lambda etc., it helped me to learn this all so quickly!
*/ 
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
    try{
        if (event.session.new){
            console.log("NEW SESSION")           
        }
        var printerName = event.request.intent.slots.printer.value    
        let params= {
            TableName: 'printData',
                    Key: {
            "printJob": 'office A'
            }
        }
        var strData = "empty"
        console.log("got this far")
        //DynamoDB API Call
        docClient.get(params, function(err, data){
            if (err){
                console.error('there was an error',JSON.stringify(err));
                context.fail(
                    generateResponse(
                        buildSpeechletResponse("Sorry, there was an error.", true),
                        {}
                    )
                )
            }else{
                callback(null, data);
                strData = JSON.stringify(data);
                console.log(strData);
                
                switch(event.request.type) {
                    //if the skill is launched with no question
                    case "LaunchRequest":
                        console.log("LAUNCH REQUEST")
                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse("welcome to the three D print monitor, I am excited to see its functionality expanded. I Hope you are too!", true),
                                {}
                            )
                        )
                        break;
                    //if a question is asked
                    case "IntentRequest":
                        //have a case for each type of question
                        switch(event.request.intent.type){
                            
                        }
                        break;
                    
                }



            }
        });
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