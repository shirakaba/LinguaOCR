import {Observable} from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {WebView, LoadEventData} from "tns-core-modules/ui/web-view";
import { Page } from "tns-core-modules/ui/page";
import { TextField } from "tns-core-modules/ui/text-field";
import { HttpServer, HttpServerDelegate } from 'nativescript-http-server';

export class wv extends Observable {
    private static OCR_SERVER_DOMAIN: string = "http://localhost:7355";
    private static OCR_SERVER_URL: string = "http://localhost:7355/index.html";
    private webview?: WebView;
    private httpServer: GCDWebServer = new HttpServer()._webServer;
    private _tftext: string = wv.OCR_SERVER_URL;
    private _result: string = "";
    private _webViewSrc: string = wv.OCR_SERVER_URL;

    get tftext(): string { return this._tftext; }
    get result(): string { return this._result; }
    get webViewSrc(): string { return this._webViewSrc; }
    
    set tftext(value: string) {
        if (this._tftext === value) return;
        this._tftext = value;
        this.notifyPropertyChange('tftext', value);
    }
    
    set result(value: string) {
        if (this._result === value) return;
        this._result = value;
        this.notifyPropertyChange('result', value);
    }    
    
    set webViewSrc(value: string) {
        if (this._webViewSrc === value) return;
        this._webViewSrc = value;
        this.notifyPropertyChange('webViewSrc', value);
    }

    constructor() {
        super();

        // // Check Bonjour services via: dns-sd -B 
        // // http://hints.macworld.com/article.php?story=20051026183044858
        // httpServer.startWithPortBonjourName(7355, "GCD Web Server");
        // /* TODO:
        //  * - Init a WebView pointing at http://localhost:7355/index.html
        //  * - Leave image.jpeg unwritten at start
        //  * - Implement an image picker.
        //  * - Implement a language pack downloader.
        //  * - Provide a way to overwrite `${NSBundle.mainBundle.resourcePath}/www/image.jpeg`.
        //  * - Provide a button for launching OCR (caution if image.jpeg isn't present)
        //  * - Provide a view for displaying results.
        //  * - Provide a way to re-select port number?
        //  * - tns platform remove ios; tns plugin add nativescript-http-server; tns run ios
        // */
    }

    navigatingTo(args) {
        console.log("navigatingTo();");
        const page: Page = <Page> args.object;

        this.httpServer.addGETHandlerForBasePathDirectoryPathIndexFilenameCacheAgeAllowRangeRequests(
            // "/www/",
            "/",
            `${NSBundle.mainBundle.resourcePath}/app/www`, // NSHomeDirectory()
            null,
            3600,
            true
        );

        // const check = setInterval(
        //     () => {
        //         if(!this.httpServer.running || !this.webview) return;
        //         console.log(`httpServer running!`);

        //         setTimeout(
        //             () => {
        //                 this.set("webViewSrc", "http://localhost:7355/index.html");
        //             },
        //             2000
        //         );
        //         clearInterval(check);
        //     },
        //     20
        // );

        // const delegate = new HttpServerDelegate();

        // HttpServerDelegate.prototype.webServerDidCompleteBonjourRegistration = (server: GCDWebServer) => {
        // delegate.webServerDidCompleteBonjourRegistration = (server: GCDWebServer) => {
        //     console.log("Custom webServerDidCompleteBonjourRegistration()");
        //     this.set("webViewSrc", "http://localhost:7355/index.html");
        // }
        // this.httpServer.delegate = delegate;
        

        this.httpServer.startWithPortBonjourName(7355, "GCD Web Server");

        // this.set("webViewSrc", "http://localhost:7355/index.html");
        // this.set("result", "");
        // this.set("tftext", "http://localhost:7355/index.html");
        page.bindingContext = this;
    }

    // handling WebView load finish event
    onWebViewLoaded(webargs) {
        console.log("onWebViewLoaded();");
        const page: Page = <Page> webargs.object.page;
        this.webview = <WebView> webargs.object;
        this.set("result", "WebView is still loading...");
        this.set("enabled", false);

        this.webview.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
            let message = "";
            if (!args.error) {
                message = `WebView finished loading of ${args.url}`;
            } else {
                message = `Error loading ${args.url} : ${args.error}`;
            }

            this.set("result", message);
            console.log(`WebView message - ${message}`);
        });
    }
    // going to the previous page if such is available
    goBack(args) {
        console.log("goBack();");
        const page: Page = <Page> args.object.page;
        const webview: WebView = <WebView> page.getViewById("wv");
        if (webview.canGoBack) {
            webview.goBack();
            this.set("enabled", true);
        }
    }
    // going forward if a page is available
    goForward(args) {
        console.log("GO FORWARD");
        const page: Page = <Page> args.object.page;
        const webview: WebView = <WebView> page.getViewById("wv");
        if (webview.canGoForward) {
            webview.goForward();
        } else {
            this.set("enabled", false);
        }
    }

    ocr(args) {
        if(this.get("webViewSrc").indexOf(wv.OCR_SERVER_DOMAIN) < 0) return;
        console.log("ocr(): domain suitable");
        this.webview!.ios.evaluateJavaScriptCompletionHandler(
            "recognize('eng');",
            (val, err) => console.log(val)
        );
    }

    // changing WebView source
    submit(args) {
        const page: Page = <Page> args.object.page;
        const textField: TextField = <TextField> args.object;
        const text = textField.text;
        this.set("enabled", false);
        if (text.substring(0, 4) === "http") {
            if(text === this.get("webViewSrc")){
                // this.webview!.reload();
                this.webview!.ios.evaluateJavaScriptCompletionHandler(
                    "location.reload(true);",
                    (val, err) => console.log(val)
                );
            } else {
                this.set("webViewSrc", text);
            }
            textField.dismissSoftInput();
        } else {
            dialogs.alert("Please, add `http://` or `https://` in front of the URL string")
            .then(() => {
                console.log("Dialog closed!");
            });
        }
    }

}