/*
Matthew Romlewski - April 2017
AWS LAMBDA FUNCTION
Shoutout to Jordan Leigh on YouTube for a great tutorial on Lambda etc., it helped me to learn this all so quickly!
*/ 
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
var data2 = retrieveFromDB("office A")
console.log(data2.item[0].part)
exports.handler = (event, context, callback) => {
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
                
                var printerName = event.request.intent.slots.printer.value

                var data = retrieveFromDB(printerName)
            
                if (data == "failed") {
                    context.fail(
                        generateResponse(
                            buildSpeechletResponse("Sorry, there was an error.", true),
                            {}
                            )
                    )
                }
                else{
                    var phrase
                    var nozT = data.item[0].NozzleTemperature
                    var bedT = data.item[0].BedTemperature
                    var mins = data.item[0].MinutesRemaining
                    var part = data.item[0].Part
                    switch(event.request.intent.name){
                        
                        case "PrintAllData":
                            

                            phrase = "Right now on ${printerName}, an item called ${part} is being printed and will take another ${mins} minutes to complete. The nozzle temperature is ${nozT} degrees celcius and the bed temperature is &{bedT} degrees celcius."
                            break;

                        case "PrintNozTemp":
                            
                            phrase = "Righ now on ${printerName}, the nozzle temperature is ${nozT} degrees celcius " 
                            break;
                        
                        case "PrintBedTemp":
                            
                            phrase = "Righ now on ${printerName}, the bed temperature is ${bedT} degrees celcius "
                            break;

                        case "PrintTimeLeft":
                            
                            phrase = "Right now on ${printerName}, the object will take another ${mins} minutes to complete."
                            break;
                        
                        case "PrintJobName":
                            
                            phrase = "Right now on ${printerName}, an item called ${part} is being printed."
                            break;
                    }
                    context.succeed(
                        generateResponse(
                            buildSpeechletResponse(phrase, true),
                            {}
                            )
                    )

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

function retrieveFromDB(printer){

    var paramsForGet = {
                TableName: "printData",
                key:{
                    "printJob": printer
                }
    }

    docClient.get(paramsForGet, function(err, data){
        if(err){
            //error handling
            return "failed";
        }else{
            return data;
        }
    });
}

/*function prepareData(data, attribute){

}*/