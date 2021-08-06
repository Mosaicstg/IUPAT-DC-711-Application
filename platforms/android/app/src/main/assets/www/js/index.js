/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

  // Application Constructor
  initialize: function () {
    app.bindEvents();
  },

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener( 'deviceready', app.onDeviceReady, false );
  },

  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {

    document.addEventListener( 'deviceready', function () {

      window.plugins.PushbotsPlugin.initialize( "56e085f717795979748b4567", { "android": { "sender_id": "720859137196" } } );

      // Only with First time registration
      window.plugins.PushbotsPlugin.on("registered", function(token){
        console.log("Registration Id:" + token);
      });

      //Get user registrationId/token and userId on PushBots, with evey launch of the app even launching with notification
      window.plugins.PushbotsPlugin.on("user:ids", function(data){
        console.log("user:ids" + JSON.stringify(data));
      });

      //iOS only
      //Reset Badge
      window.plugins.PushbotsPlugin.resetBadge();
      //Set badge
      window.plugins.PushbotsPlugin.setBadge(0);

      // Should be called once app receive the notification [foreground/background]
      window.plugins.PushbotsPlugin.on("notification:received", function(data){
        console.log("received:" + JSON.stringify(data));

        //iOS: [foreground/background]
        console.log("notification received from:" + data.cordova_source);
        //Silent notifications Only [iOS only]
        //Send CompletionHandler signal with PushBots notification Id
        window.plugins.PushbotsPlugin.done(data.pb_n_id);
      });

      window.plugins.PushbotsPlugin.on("notification:clicked", function(data){
        // var userToken = data.token;
        // var userId = data.userId;
        console.log("clicked:" + JSON.stringify(data));
      });

      app.receivedEvent( 'deviceready' );

      // Should be called once app receive the notification
      window.plugins.PushbotsPlugin.on( "notification:received", function ( data ) {
        console.log( "received:" + JSON.stringify( data ) );
      } );

      // Should be called once the notification is clicked
      window.plugins.PushbotsPlugin.on( "notification:clicked", function ( data ) {
        console.log( "clicked:" + JSON.stringify( data ) );
      } );

    }, false );
  },

  // Update DOM on a Received Event
  receivedEvent: function ( id ) {
    var parentElement    = document.getElementById( id );
    var listeningElement = parentElement.querySelector( '.listening' );
    var receivedElement  = parentElement.querySelector( '.received' );

    listeningElement.setAttribute( 'style', 'display:none;' );
    receivedElement.setAttribute( 'style', 'display:block;' );
  }
};
