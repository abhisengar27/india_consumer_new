module.exports = {
    "DIGILOCKER": {
        "APP_ID": "oaoindiadev",
        "APP_KEY": "IE91i3PtZBSrPqYpPVi6",
        "SHARE_URL": "https://devservices.digitallocker.gov.in/requester/api/2/dl.js",
        "FETCH_URL": "https://devpartners.digitallocker.gov.in/public/requestor/api/pulldoc/1/xml",
        "ISSUER_ID": "com.latitudefintech"
    },
    "ALFRESCO": {
        "cmis_alfresco_url": "http://106.51.72.98:8180/alfresco/cmisbrowser",
        "alfresco_username": "empOnbrdInd",
        "alfresco_password": "admin",
        "alfresco_folder_id": "70a5428c-19c5-493f-8909-6534c98cef24"
    },
    "OUTLOOK_365": {
        creds: {
            redirectUrl: 'https://indiaconsumer.herokuapp.com/',
            clientID: 'e59d6bdd-3cd6-4886-8432-9d288d945846',
            clientSecret: 'kFs08rxjVrDGHmFWaCCJvzb',
            identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
            allowHttpForRedirectUrl: true,
            responseType: 'code',
            validateIssuer: false,
            responseMode: 'query',
            scope: ['User.Read', 'Mail.Send', 'Files.ReadWrite']
        },
        isOutlook365Enabled: true
    },
    "UIDAI": {
        "endPointUrl": "https://aadhaarapi.herokuapp.com/uidai"
    }


}