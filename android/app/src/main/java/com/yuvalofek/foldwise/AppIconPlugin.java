package com.yuvalofek.foldwise;

import android.content.ComponentName;
import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Switches the launcher icon (Setup → App Icon) by enabling one activity-alias from
 * AndroidManifest.xml and disabling the others. Names match the iOS alternate icon sets
 * ("AppIcon-LegalPad"); no name means the Foldwise icon.
 */
@CapacitorPlugin(name = "AppIcon")
public class AppIconPlugin extends Plugin {

    private static final String DEFAULT = "IconFoldwise";
    private static final String[] ALIASES = { DEFAULT, "IconLegalPad", "IconIndexCard", "IconStickyNote" };

    @PluginMethod
    public void getName(PluginCall call) {
        PackageManager pm = getContext().getPackageManager();
        for (String alias : ALIASES) {
            if (!alias.equals(DEFAULT) && isEnabled(pm, alias)) {
                JSObject result = new JSObject();
                result.put("name", "AppIcon-" + alias.substring("Icon".length()));
                call.resolve(result);
                return;
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void setName(PluginCall call) {
        String name = call.getString("name");
        String target = name == null ? DEFAULT : "Icon" + name.replace("AppIcon-", "");
        boolean known = false;
        for (String alias : ALIASES) known |= alias.equals(target);
        if (!known) {
            call.reject("Unknown icon: " + name);
            return;
        }
        PackageManager pm = getContext().getPackageManager();
        // Enable the new icon before disabling the others, so the app is never left without one.
        pm.setComponentEnabledSetting(component(target), PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
        for (String alias : ALIASES) {
            if (!alias.equals(target)) {
                pm.setComponentEnabledSetting(component(alias), PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
            }
        }
        call.resolve();
    }

    private boolean isEnabled(PackageManager pm, String alias) {
        int state = pm.getComponentEnabledSetting(component(alias));
        if (state == PackageManager.COMPONENT_ENABLED_STATE_DEFAULT) return alias.equals(DEFAULT);
        return state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED;
    }

    private ComponentName component(String alias) {
        return new ComponentName(getContext(), getContext().getPackageName() + "." + alias);
    }
}
