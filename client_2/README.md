<h1> Client service. </h1>
<br>

<h2> 
  Pre-launch setup.
</h2>
<br>
<ul>

  <li>
    <h3> Generating new keys. </h3>
    <p> Run the following command to generate new key pairs: </p>
    <p><i> I advise you to check the keys as they may not be written to the file correctly ( in folder <b>'RSA_keys'</b> ) </p>

    npm run generateKeys
    
  <p>
    OR
  </p>

    deno run --allow-write generateKeys.ts

  </li>

  <br>

  <li>
    <h3>
      Сonfigure the config file.
    </h3>
    <p>
      <b> SSOAddres </b> - contains the SSO server address.
    </p>
    <p>
      <b> PORT </b> - the port on which the server will start.
    </p>
    <p>
      <b> PROTOCOL </b> - the protocol by which the server is used.
    </p>
  </li>

</ul>

<br>

<h2> Starting the server. </h2>
<br>
<p> To start the server, run one of the following commands: </p>

    npm run start

  <p> OR </p>

    deno run --allow-net --allow-read --allow-sys server.ts