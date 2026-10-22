import Capacitor
import UIKit

/// Switches the home-screen icon between Foldwise and the alternate icons in Assets.xcassets
/// (Setup → App Icon). iOS shows its own alert after each change.
@objc(AppIconPlugin)
public class AppIconPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AppIconPlugin"
    public let jsName = "AppIcon"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getName", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setName", returnType: CAPPluginReturnPromise),
    ]

    /// The alternate icon in use; no `name` means the Foldwise icon.
    @objc func getName(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if let name = UIApplication.shared.alternateIconName {
                call.resolve(["name": name])
            } else {
                call.resolve()
            }
        }
    }

    /// `name` is an alternate icon set (e.g. "AppIcon-LegalPad"); null restores the Foldwise icon.
    @objc func setName(_ call: CAPPluginCall) {
        let name = call.getString("name")
        DispatchQueue.main.async {
            guard UIApplication.shared.supportsAlternateIcons else {
                call.reject("Alternate icons are not supported on this device")
                return
            }
            UIApplication.shared.setAlternateIconName(name) { error in
                if let error = error {
                    call.reject(error.localizedDescription)
                } else {
                    call.resolve()
                }
            }
        }
    }
}
