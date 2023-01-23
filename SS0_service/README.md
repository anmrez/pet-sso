<h1> Single sign-one service. </h1>
<br>
<p> 
  <b>Single sign-on (SSO)</b> is a technology which combines several different application login screens into one. With SSO, a user only has to enter their login credentials (username, password, etc.) one time on a single page to access all of their applications.
</p>

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
      <b> clientServices </b> - contains a list of verified addresses.
    </p>
    <p>
      <b> PORT </b> - the port on which the server will start.
    </p>
  </li>

</ul>

<br>

<h2> Starting the server. </h2>
<br>
<p> To start the server, run one of the following commands: </p>

    npm run start

  <p> OR </p>

    deno run --allow-net --allow-read server.ts