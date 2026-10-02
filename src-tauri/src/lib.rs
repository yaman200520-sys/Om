#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default();

    #[cfg(target_os = "windows")]
    {
        builder = builder.plugin(
            tauri_plugin_snap_layout::init()
                .button_id("om-maximize-button")
                .build(),
        );
    }

    builder
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    #[cfg(not(mobile))]
                    {
                        api.prevent_close();
                        let _ = window.hide();
                    }
                }
            }
        })
        .setup(|_app| {
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Om-LifeOS");
}
