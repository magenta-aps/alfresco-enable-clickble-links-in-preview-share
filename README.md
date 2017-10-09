# Alfresco Share JAR Module - SDK 3.0.1

To run this module use `mvn clean install -DskipTests=true alfresco:run` or `./run.sh` and verify that it 

This module brings in the fix to enable clickable links in document previews.
The original fix is located here is this [pull request!](https://github.com/Alfresco/share-old/pull/2/commits/9b89fdbe72f0d6ba7ae24d396fa246ce9c2c498c) but has been abstracted into this module so as to make it possible to
apply it to other alfresco versions that may not have the fix included.
 
 
# Few things to notice regarding SDK related issues

 * It is not possible to see the changed applied if run locally using maven to test it in an embedded tomcat 
 * When deployed to an alfresco instance currently the PdfJs files are replaced successfully but the minified version
 remains that of the original out-of-the-box after server startup hence the reason for also providing the minified file.
 Files were minified using [HookyQR minify plugin!](https://marketplace.visualstudio.com/items?itemName=HookyQR.minify)for [Visual Studio Code!](https://code.visualstudio.com/Download).
   
  
 
