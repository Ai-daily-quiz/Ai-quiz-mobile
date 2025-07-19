import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: 'http://localhost:5173' }}
        // source={{ uri: 'https://dk44bvz564mpy.cloudfront.net' }}
        // source={{ uri: 'http://192.168.0.17:5173' }}
        startInLoadingState={true}
        onMessage={event => {
          console.log('WebView:', event.nativeEvent.data);
        }}
        injectedJavaScript={`
    window.addEventListener('error', (e) => {
      window.ReactNativeWebView.postMessage('Error: ' + e.message);
    });
    
    // Fetch 요청 가로채기
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      window.ReactNativeWebView.postMessage('Fetch: ' + args[0]);
      return originalFetch.apply(this, args)
        .catch(err => {
          window.ReactNativeWebView.postMessage('Fetch Error: ' + err.message);
          throw err;
        });
    };
    true;
  `}
      />
    </SafeAreaView>
  );
}

export default App;
