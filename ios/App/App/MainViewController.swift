import Capacitor

/// The app's bridge view controller (Main.storyboard). Registers the app's own plugins.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(AppIconPlugin())
        bridge?.registerPluginInstance(SubscriptionsPlugin())
    }
}
