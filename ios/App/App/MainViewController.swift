import Capacitor
import ObjectiveC
import UIKit
import WebKit

/// The app's bridge view controller (Main.storyboard). Registers the app's own plugins.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(AppIconPlugin())
        bridge?.registerPluginInstance(SubscriptionsPlugin())
        hideFormAccessoryBar()
    }

    /// iOS puts a "^ v Done" bar above the keyboard of any web page input. The real Notes app has
    /// none, so the secret entry mustn't either. WKWebView has no setting for it: the web content
    /// view gets a subclass whose inputAccessoryView is nil (the same approach as Capacitor's
    /// Keyboard plugin).
    private func hideFormAccessoryBar() {
        guard let webView = webView,
              let contentView = webView.scrollView.subviews.first(where: {
                  String(describing: type(of: $0)).hasPrefix("WKContent")
              })
        else { return }
        let baseClass: AnyClass = type(of: contentView)
        let name = "\(NSStringFromClass(baseClass))_NoAccessoryBar"
        var subclass: AnyClass? = NSClassFromString(name)
        if subclass == nil, let newClass = objc_allocateClassPair(baseClass, name, 0) {
            let noBar: @convention(block) (AnyObject) -> UIView? = { _ in nil }
            class_addMethod(newClass, #selector(getter: UIResponder.inputAccessoryView),
                            imp_implementationWithBlock(noBar), "@@:")
            objc_registerClassPair(newClass)
            subclass = newClass
        }
        if let subclass = subclass {
            object_setClass(contentView, subclass)
        }
    }
}
