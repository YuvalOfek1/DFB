import Capacitor
import StoreKit
import UIKit

/// Apple's own Manage Subscriptions sheet, shown over the app, so someone who bought Lifetime can
/// cancel the monthly plan in one tap. Apps can't cancel a subscription themselves.
@objc(SubscriptionsPlugin)
public class SubscriptionsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SubscriptionsPlugin"
    public let jsName = "Subscriptions"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "showManageSubscriptions", returnType: CAPPluginReturnPromise),
    ]

    /// Resolves once the sheet is closed.
    @objc func showManageSubscriptions(_ call: CAPPluginCall) {
        Task { @MainActor in
            guard let scene = self.bridge?.viewController?.view.window?.windowScene else {
                call.reject("No window to show the sheet in")
                return
            }
            do {
                try await AppStore.showManageSubscriptions(in: scene)
                call.resolve()
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }
}
