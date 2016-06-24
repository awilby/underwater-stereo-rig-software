//
//  ViewController.swift
//  3D Rig
//
//  Created by Kevin Zhang on 5/25/16.
//  Copyright © 2016 UCSD. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBAction func reloadBtn(sender: AnyObject) {
        self.webView.reload()
    }
    
    @IBOutlet var webView: UIWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        let url = "http://10.0.1.2/"
        
        let requestURL = NSURL(string:url)
        let request = NSURLRequest(URL: requestURL!)
        
        webView.loadRequest(request)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

