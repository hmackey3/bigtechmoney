import { supabase } from "@/integrations/supabase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum AuditActionType {
    ACCOUNT_DELETION = 'ACCOUNT_DELETION',
    PLAN_UPGRADE = 'PLAN_UPGRADE',
    INVITE_SENT = 'INVITE_SENT',
    ROLE_CHANGE = 'ROLE_CHANGE',
    LOGIN = 'LOGIN',
    SETTINGS_CHANGE = 'SETTINGS_CHANGE',
    ACCOUNT_DEACTIVATION = 'ACCOUNT_DEACTIVATION',
    ACCOUNT_ACTIVATION = 'ACCOUNT_ACTIVATION',
    PASSWORD_RESET = 'PASSWORD_RESET',
    INVITATION = 'INVITATION',
}

interface LogAuditParams {
    actionType: AuditActionType;
    description: string;
    metadata?: Record<string, any>;
}

const getUserIP = async (): Promise<string> => {
    try {
        const res = await fetch("https://api64.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch {
        return "unknown"; // Fallback if API fails
    }
};

// Function to get device information (browser, OS)
const getDeviceInfo = (): Record<string, string> => {
    const deviceInfo: Record<string, string> = {
        browser: navigator.userAgent,
        os: navigator.platform,
        language: navigator.language,
        online: navigator.onLine ? "true" : "false",
    };
    return deviceInfo;
};

export const logAuditEvent = async ({
    actionType,
    description,
    metadata = {}
    
}: LogAuditParams): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("system_account_id, full_name")
            .eq("id", user.id)
            .single();

        if (!user) {
            console.error('Cannot log audit event: No authenticated user');
            return;
        }

        if (profileError || !profileData) {
            console.error('Error fetching profile data:', profileError);
            return;
        }

        // Prefix the description with the user's full name
        const prefixedDescription = `${profileData.full_name} ${description}`;

        const ipAddress = await getUserIP();
        const deviceInfo = getDeviceInfo();

        const combined = {
            ...metadata,
            deviceInfo
        };

        // The IP will be captured by our server-side function
        const { error } = await supabase.from('audit_logs').insert({
            user_id: profileData.system_account_id,
            action_type: actionType,
            description: prefixedDescription,
            metadata: combined,
            ip_address: ipAddress,
        });

        if (error) {
            console.error('Error logging audit event:', error);
        }
    } catch (error) {
        console.error('Failed to log audit event:', error);
    }
};
