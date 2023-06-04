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


    import {successLOCAL} from '../../lib/stores.js';
    let success = [0,0,0,0,0];
    successLOCAL.subscribe(value => {
      let readVal = value;
      success = JSON.parse(value);
      console.log("SUCC VAL RECEIVED " + success);
    });

    var simpleCrypto = new SimpleCrypto("codeiscool")

    // version 1: encrypted code for every level
    let plainText = name;
    // let encryptedCodes = [];
    // let plainTextCodes = [];
    // for (let i = 0; i < 5; i++){
    //     let plainText = data.name + i.toString();
    //     const cipherText = simpleCrypto.encrypt(plainText)
    //     console.log("Encryption process...")
    //     console.log("Plain Text    : " + plainText)
    //     console.log("Cipher Text   : " + cipherText)
    //     const decipherText = simpleCrypto.decrypt(cipherText)
    //     console.log("... and then decryption...")
    //     console.log("Decipher Text : " + decipherText)
    //     console.log("... done.")
    //     plainTextCodes.push(plainText)
    //     encryptedCodes.push(cipherText)
    // }
    // console.log(plainTextCodes)
    // console.log(encryptedCodes)

    // version 2: single encrypted code communicating success at each level
    plainText = name + success.toString();
    const cipherText = simpleCrypto.encrypt(plainText)
    console.log("Encryption process...")
    console.log("Plain Text    : " + plainText)
    console.log("Cipher Text   : " + cipherText)
    const decipherText = simpleCrypto.decrypt(cipherText)
    console.log("... and then decryption...")
    console.log("Decipher Text : " + decipherText)
    console.log("... done.")

    $: {
        plainText = name + success.toString();
        const cipherText = simpleCrypto.encrypt(plainText)
        console.log("Encryption process...")
        console.log("Plain Text    : " + plainText)
        console.log("Cipher Text   : " + cipherText)
        const decipherText = simpleCrypto.decrypt(cipherText)
        console.log("... and then decryption...")
        console.log("Decipher Text : " + decipherText)
        console.log("... done.")
    
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

<!-- <h2 class="title">
    Progress
</h2> -->

<div class="table-container">
    <table class="unfixed-table">
      <thead>
        <tr>
            <th colspan="2" style="font-size: 30px">{name}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="total"><th>Level</th><th>Completed?</th></tr>
        <tr><th>0</th><td>{success[0]==1 ? "yes" : "no"}</td></tr>
        <tr><th>1</th><td>{success[1]==1 ? "yes" : "no"}</td></tr>
        <tr><th>2</th><td>{success[2]==1 ? "yes" : "no"}</td></tr>
        <tr><th>3</th><td>{success[3]==1 ? "yes" : "no"}</td></tr>
        <tr><th>4</th><td>{success[4]==1 ? "yes" : "no"}</td></tr>
        <tr class="total"><th>Total</th><td colspan="1" style="font-weight:bold">{totalSuccess}/5</td></tr>
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
    
    .title {
        margin: 20px;
        
    }

   table {
        border-collapse: collapse; 
    }

    thead th {
        background: hsl(20, 50%, 70%);
        width: 10%;
    }

    .total th, .total td {
        background: hsl(21, 31%, 80%);
    }

    th {
        min-width: 60px;
    }

    td, th {
        border:  1px solid;
        padding: 10px;
        background: white;
        box-sizing: border-box;
        text-align: left;
        max-width: 100px;
    }

    td {
        min-width: 230px;
    }

    tfoot td, tfoot th{
        font-weight: bold;
        background: rgb(231, 231, 231);
    }

    .table-container {
        margin: 20px;
        position: relative;
        /* max-height:  300px; */
        /* width: 500px; */
        /* overflow: scroll; */
    }

</style>
