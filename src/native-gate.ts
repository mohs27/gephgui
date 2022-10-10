/**
 * An object that represents the communication interface with the native side of a Geph frontend.
 */
export interface NativeGate {
  /**
   * Starts the daemon. Only resolves when the daemon is confirmed to be running.
   */
  start_daemon(daemon_args: DaemonArgs): Promise<void>;

  /**
   * Stops the daemon. Only resolves when the daemon is confirmed to have stopped running.
   */
  stop_daemon(): Promise<void>;

  /**
   * Obtains whether the *daemon* is running
   */
  is_running(): Promise<boolean>;

  /**
   * Obtains whether the *connection* is working
   */
  is_connected(): Promise<boolean>;

  /**
   * Obtains the current user information
   */
  sync_user_info(username: string, password: string): Promise<SubscriptionInfo>;

  /**
   * Obtains the list of all exits
   */
  sync_exits(): Promise<ExitDescriptor[]>;

  /**
   * Whether this platform supports app whitelists
   */
  supports_app_whitelist: boolean;

  /**
   * Whether this platform supports proxy configuration
   */
  supports_proxy_conf: boolean;

  /**
   * Obtains native info, for debugging. The return type may be extended, and should not guide application logic.
   */
  native_info: NativeInfo;
}

/**
 * Exit descriptor
 */
export interface ExitDescriptor {
  hostname: string;
  signing_key: string;
  country_code: string;
  city_code: string;
  allowed_levels: Level[];
}

/**
 * Arguments passed to start the Geph daemon.
 */
export interface DaemonArgs {
  // core arguments
  username: string;
  password: string;

  // platform-specific arguments
  app_whitelist: string[];
  china_whitelist: boolean;
}

/**
 * Native information.
 */
export interface NativeInfo {
  platform_type: "windows" | "macos" | "linux" | "android" | "ios";
  platform_details: string;
  daemon_version: string;
}

/**
 * User info
 */
export interface SubscriptionInfo {
  level: Level;
  expires: Date | null;
}

type Level = "free" | "plus";

function mock_native_gate(): NativeGate {
  let connected = false;
  let running = false;
  return {
    start_daemon: async () => {
      await random_sleep();
      running = true;
      setTimeout(() => (connected = true), 1000);
    },
    stop_daemon: async () => {
      await random_sleep();
      connected = false;
      running = false;
    },
    is_connected: async () => {
      return connected;
    },
    is_running: async () => {
      return running;
    },
    sync_user_info: async () => {
      await random_sleep();
      return {
        level: "free",
        expires: new Date(),
      };
    },

    sync_exits: async () => {
      return [
        {
          hostname: "us-hio-03.exits.geph.io",
          city_code: "pdx",
          country_code: "us",
          signing_key:
            "e0c3af135a4c835c1b7b9df3e01be4b69a1c00e948d12bf4df2c33e08d4cecff",
          allowed_levels: ["free", "plus"],
        },
        {
          hostname: "sg-sgp-04.exits.geph.io",
          city_code: "sgp",
          country_code: "sg",
          signing_key:
            "5b97a2927dc59acec57784a03e620f2c7b595f01e1030d3f7c1aef76d378f83c",
          allowed_levels: ["plus"],
        },
      ];
    },

    supports_app_whitelist: true,
    supports_proxy_conf: true,
    native_info: {
      platform_type: "linux",
      platform_details: "MockLinux Trololol",
      daemon_version: "0.0.0-mock",
    },
  };
}

window["NATIVE_GATE"] = mock_native_gate();

async function random_sleep() {
  await new Promise((r) => setTimeout(r, Math.random() * 5000));
}

export function native_gate(): NativeGate {
  return window["NATIVE_GATE"] as NativeGate;
}
