//import aws-sdk
import * as AWS from "aws-sdk";
import { exit } from "process";
//get environment variables from .env file
require("dotenv").config();

// get input from console
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;

waitforuserinput();

function waitforuserinput() {
  readline.question(
    "Enter the region you want to use, eg us-east-1: ",
    (region: string = "us-east-1") => {
      // set credentials
      configureAWS(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, region);
      readline.question(
        "Enter the fully qualified domain name (FQDN) for the certificate, eg deptdxp.com: ",
        (domain: string) => {
          createCertificate(domain);
          setTimeout(() => {
            readline.question(
              "Do you want to create another certificate? (y/n): ",
              (answer: string) => {
                if (answer === "y") {
                  waitforuserinput();
                } else {
                  readline.close();
                  exit();
                }
              }
            );
          }, 5000);
        }
      );
    }
  );
}

function createCertificate(domain: string): AWS.ACM.RequestCertificateResponse {
  const acm = new AWS.ACM();
  const params = {
    DomainName: domain,
    ValidationMethod: "DNS",
  };
  acm.requestCertificate(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data); // successful response
      return data;
    }
  });
  return { CertificateArn: "" };
}

function configureAWS(
  aws_access_key_id: string,
  aws_secret_access_key: string,
  regionP: string
) {
  AWS.config.update({
    accessKeyId: aws_access_key_id,
    secretAccessKey: aws_secret_access_key,
    region: regionP,
  });
}
