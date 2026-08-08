import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function BidLoader({ visible, status }) {
  const webViewRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (visible) {
      if (Platform.OS === 'web') {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(status, '*');
        }
      } else if (webViewRef.current) {
        webViewRef.current.postMessage(status);
      }
    }
  }, [status, visible]);

  if (!visible) return null;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: rgba(248, 250, 252, 0.95);
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        #truck-container {
          display: none;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .truckWrapper {
          width: 300px;
          height: 160px;
          display: flex;
          flex-direction: column;
          position: relative;
          align-items: center;
          justify-content: flex-end;
          overflow-x: hidden;
        }

        .truckBody {
          width: 200px;
          height: fit-content;
          margin-bottom: 8px;
          animation: motion 1s linear infinite;
        }

        .trucksvg {
          width: 100%;
          height: auto;
        }

        @keyframes motion {
          0% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
          100% { transform: translateY(0px); }
        }

        .truckTires {
          width: 200px;
          height: fit-content;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0px 15px 0px 22px;
          position: absolute;
          bottom: 0;
          box-sizing: border-box;
        }

        .tiresvg {
          width: 36px;
          height: 36px;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .road {
          width: 100%;
          height: 2.5px;
          background-color: ${Colors.primary};
          position: relative;
          bottom: 0;
          align-self: flex-end;
          border-radius: 3px;
        }
 
        .road::before {
          content: "";
          position: absolute;
          width: 30px;
          height: 100%;
          background-color: ${Colors.primary};
          right: -50%;
          border-radius: 3px;
          animation: roadAnimation 1.4s linear infinite;
          border-left: 15px solid ${Colors.background};
        }
 
        .road::after {
          content: "";
          position: absolute;
          width: 15px;
          height: 100%;
          background-color: ${Colors.primary};
          right: -65%;
          border-radius: 3px;
          animation: roadAnimation 1.4s linear infinite;
          border-left: 6px solid ${Colors.background};
        }
 
        .lampPost {
          position: absolute;
          bottom: 0;
          right: -90%;
          height: 140px;
          animation: roadAnimation 1.4s linear infinite;
          fill: ${Colors.textSecondary};
        }
 
        @keyframes roadAnimation {
          0% { transform: translateX(0px); }
          100% { transform: translateX(-350px); }
        }
 
        /* Large SVG Draw Success Animation */
        #success-container {
          display: none;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
 
        .checkmark-svg {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          display: block;
          stroke-width: 4;
          stroke: #10B981;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #10B981;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s dashed;
          margin-bottom: 25px;
        }
 
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 4;
          stroke-miterlimit: 10;
          stroke: #10B981;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
 
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #10B981;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
 
        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }
 
        @keyframes scale {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }
 
        @keyframes fill {
          100% { box-shadow: inset 0px 0px 0px 65px rgba(16, 185, 129, 0.1); }
        }
 
        .success-text {
          color: ${Colors.textPrimary};
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
      </style>
      <script>
        function updateLayout(currentStatus) {
          if (currentStatus === 'success') {
            document.getElementById('truck-container').style.display = 'none';
            document.getElementById('success-container').style.display = 'flex';
          } else {
            document.getElementById('truck-container').style.display = 'flex';
            document.getElementById('success-container').style.display = 'none';
          }
        }

        window.addEventListener("message", function(event) {
          updateLayout(event.data);
        });
      </script>
    </head>
    <body onload="updateLayout('${status}')">
      <div id="truck-container">
        <div class="loader">
          <div class="truckWrapper">
            <div class="truckBody">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 198 93" class="trucksvg">
                <path stroke-width="3" stroke="#ffffff" fill="#F83D3D" d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z" />
                <path stroke-width="3" stroke="#ffffff" fill="#7D7C7C" d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" />
                <path stroke-width="2" stroke="#ffffff" fill="#ffffff" d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" />
                <rect stroke-width="2" stroke="#ffffff" fill="#FFFCAB" rx="1" height="7" width="5" y="63" x="187" />
                <rect stroke-width="2" stroke="#ffffff" fill="#ffffff" rx="1" height="11" width="4" y="81" x="193" />
                <rect stroke-width="3" stroke="#ffffff" fill="#DFDFDF" rx="2.5" height="90" width="121" y="1.5" x="6.5" />
                <rect stroke-width="2" stroke="#ffffff" fill="#ffffff" rx="2" height="4" width="6" y="84" x="1" />
              </svg>
            </div>
            <div class="truckTires">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class="tiresvg">
                <circle stroke-width="3" stroke="#ffffff" fill="#282828" r="13.5" cy="15" cx="15" />
                <circle fill="#DFDFDF" r="7" cy="15" cx="15" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class="tiresvg">
                <circle stroke-width="3" stroke="#ffffff" fill="#282828" r="13.5" cy="15" cx="15" />
                <circle fill="#DFDFDF" r="7" cy="15" cx="15" />
              </svg>
            </div>
            <div class="road"></div>
            <svg xml:space="preserve" viewBox="0 0 453.459 453.459" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Capa_1" version="1.1" fill="#ffffff" class="lampPost">
              <path d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
        c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
        c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
        c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
        h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
        v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
        V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
        M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
        h78.747C231.693,100.736,232.77,106.162,232.77,111.694z" />
            </svg>
          </div>
        </div>
      </div>

      <div id="success-container">
        <svg class="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <div class="success-text">SUCCESS</div>
      </div>
    </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'rgba(248, 250, 252, 0.95)' }}
          title="bid-loader"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView 
        ref={webViewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        source={{ html: htmlContent }} 
        style={styles.webview} 
        scrollEnabled={false}
        overScrollMode="never"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 99999,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
  },
  webview: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
  },
});
