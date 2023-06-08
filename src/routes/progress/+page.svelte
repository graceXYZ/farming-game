<script>
    import '../../styles.css';
    export let data;

    import SimpleCrypto from "simple-crypto-js"

    let totalSuccess = 0;

    import {nameStore} from '../../lib/stores.js';
    let name = "";
    nameStore.subscribe(value => {
        name = value;
    });

    import {emailStore} from '../../lib/stores.js';
    let email = "";
    emailStore.subscribe(value => {
        email = value;
    });


    import {successLOCAL} from '../../lib/stores.js';
    import { goto } from '$app/navigation';
    let success = [0,0,0,0,0];
    successLOCAL.subscribe(value => {
      let readVal = value;
      success = JSON.parse(value);
      console.log("SUCC VAL RECEIVED " + success);
    });

    var simpleCrypto = new SimpleCrypto("codeiscool")

    function encryptASCII(name, email, successArray) {
        // NAME_EMAIL_successArray string split by character
        // each character converted to ASCII number. (uppercase letters only)
        // random letter placed in between each ASCII code
        let stringCode = name + "_" + email + "_" + success.toString();
        console.log("stringCode: " + stringCode)
        stringCode = stringCode.toUpperCase();
        let chars = stringCode.split("");
        let charsEncrypt = ""
        let allChars = "ABCDEFGHIJKLMNOPQURTUVWXYZ1234567890!@#$%^&*()./<>?;-=_+"; // replace this with ASCII order or something. Intentionally exclude commas cuz there will be commas in string of success array
        let separatorChars = "asdfghjklzxcvbnmqwertyuiop";
        chars.forEach(element => {
            let uppercase = element.toUpperCase();
            let eNum = allChars.indexOf(uppercase);
            if (eNum > -1) {
                let ran = Math.random() * 10
                charsEncrypt += eNum + separatorChars.charAt(ran)
            }
        });
        console.log("cipherText: " + charsEncrypt);
        return charsEncrypt;
    }

    function decryptASCII(code) {
        let allChars = "ABCDEFGHIJKLMNOPQURTUVWXYZ1234567890!@#$%^&*()./<>?;-=_+"; // replace this with ASCII order or something. Intentionally exclude commas cuz there will be commas in string of success array
        let separatorChars = "asdfghjklzxcvbnmqwertyuiop";
        let decryptChars = "";
        let codeArray = code.split("");
        let i = 0;
        while (i< code.length){
            // while we haven't found a separator char
            let j = i;
            let thisChar = code.charAt(i)
            while (separatorChars.indexOf(code.charAt(j)) < 1) {
                j ++;
                thisChar += code.charAt(j)
            }
            let index = parseInt(thisChar);
            thisChar = allChars.charAt(index)
            decryptChars += thisChar;
            // next is separator, so skip it too
            i = j+1;
        }
        
        return decryptChars;
    }

    function simpleEncryptBase64(name, email, success) {
        let nameClean = ""
        let nameArray = name.split("");
        nameArray.forEach(element => {
            if (element != "," && element != "+") {
                nameClean += element;
            }
        });
        let emailClean = ""
        let emailArray = email.split("");
        emailArray.forEach(element => {
            if (element != "," && element != "+") {
                emailClean += element;
            }
        });
        // NOTE: no commas or plus signs are allowed in Name or UniqueID fields
        let stringCode = nameClean + "+" + emailClean + "+" + success.toString();
        stringCode = stringCode.toUpperCase();
        let chars = stringCode.split("");
        let cleanString = "";
        chars.forEach(element => {
            if (element != ",") {
                cleanString += element;
            }
        });
        console.log("stringCode: " + cleanString)
        let charsEncrypt = btoa(cleanString)
        console.log("cipherText: " + charsEncrypt);
        return charsEncrypt;
    }

    function fancyEncrypt(name, success) {
        // single encrypted code communicating success at each level
        let plainText = name + success.toString();
        let cipherTextL = simpleCrypto.encrypt(plainText)
        console.log("Encryption process...")
        console.log("Plain Text    : " + plainText)
        console.log("Cipher Text   : " + cipherTextL)
        const decipherText = simpleCrypto.decrypt(cipherTextL)
        console.log("... and then decryption...")
        console.log("Decipher Text : " + decipherText)
        console.log("... done.")
        return cipherTextL;
    }

    function simpleDecryptBase64(cipherText) {
        let decode = atob(cipherText);
        return decode
    }

    let cipherText = simpleEncryptBase64(name, email, success)
    let decryptChars = simpleDecryptBase64(cipherText);
    console.log("decryptChars: " + decryptChars)

    $: {
        // cipherText = fancyEncrypt(name, success)
        cipherText = simpleEncryptBase64(name, email, success)
        
        totalSuccess = 0;
        success.forEach( num => {
            totalSuccess += num;
        });
    }


    const copyContent = async () => {
        var copyText = document.getElementById("codeContainer");
        try {
            await navigator.clipboard.writeText(copyText.value);
            console.log('Content copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    


</script>

<div class="table-container">
    <table class="unfixed-table">
      <thead>
        <tr>
            <th colspan="2">
                <div class="headerTItle">
                    <div style="font-size: 25px;">
                        {name} 
                    </div>
                    <div style="font-size: 15px; font-family: 'Fira Code', normal;">
                        {email}
                    </div>
                </div>
                
            </th>
            
        </tr>
      </thead>
      <tbody>
        <tr class="total"><th>Level</th><th>Completed?</th></tr>
        <tr><th>0</th><td>{success[0]==1 ? "yes" : "no"}</td></tr>
        <tr><th>1</th><td>{success[1]==1 ? "yes" : "no"}</td></tr>
        <tr><th>2</th><td>{success[2]==1 ? "yes" : "no"}</td></tr>
        <tr><th>3</th><td>{success[3]==1 ? "yes" : "no"}</td></tr>
        <tr><th>4</th><td>{success[4]==1 ? "yes" : "no"}</td></tr>
        <tr class="total"><th>Total</th><td colspan="1" style="font-weight:bold">{totalSuccess} / 5</td></tr>
       </tbody>
      
      <tfoot>
        <tr>
            <th>Code</th>
            <td colspan="3">
                <div style="display: grid; grid-template-columns: 80px 1fr;"> 
                    <button on:click={copyContent} style="width: 70px; padding: 10px;">Copy</button>
                    <input type="text" value="{cipherText}" id="codeContainer" style="display: none;">
                    <div style="font-size:9px; word-break: break-all;">{cipherText}</div>
                </div>
            </td>
            
        </tr>
      </tfoot>
    </table>
    
</div>

<style>
    

    .headerTItle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 20px;
        width: 100%;
        align-items: baseline;
    }
    * {
        font-family: 'Roboto Flex Variable';
        font-style: normal;
        font-weight: 500;
    }
    
    .title {
        margin: 20px;
        font-family: 'Roboto Flex Variable', normal;
        font-weight: 300;
    }

   table {
        border-collapse: collapse; 
    }

    thead th {
        background: rgba(0, 0, 0, 0.15);
        width: 10%;
        font-family: 'Fira Code', normal;
    }

    .total th, .total td {
        background: rgba(0, 0, 0, 0.25);
    }

    th {
        min-width: 60px;
    }

    td, th {
        border:  1px solid;
        padding: 10px;
        background: rgba(0, 0, 0, 0.15);
        box-sizing: border-box;
        text-align: left;
        max-width: 100px;
    }

    td {
        min-width: 230px;
    }

    tfoot td, tfoot th{
        font-weight: bold;
        background: rgba(0, 0, 0, 0.15);
    }

    .table-container {
        margin: 20px;
        position: relative;


        /* max-height:  300px; */
        /* width: 500px; */
        /* overflow: scroll; */
    }

</style>
