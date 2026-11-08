export const constants = {
    ScString_width: 32,

    Color_channels: [16, 8, 0],
    Color_mask: 0xff,
    Color_hexDigits: 6,

    LogicDataTables_globalIdStep: 1000000,

    Badge_sc: "sc/ui.sc",
    Badge_clip: "popover_text_left",
    Badge_field: "text",
    Badge_text: "Memory v69.252\nTelegram: @memoryutils",
    Badge_x: 120.0,
    Badge_y: 90.0,
    Badge_fontSize: 14,
    Badge_fontOutline: 1,
    Badge_color: 0xffffffff,
    Badge_bandChars: 2,
    Badge_lightColor: 0x6ee787,
    Badge_darkColor: 0x1a7f37,
    Badge_gradientTable: 46,
    Badge_gradientId: 1,
    Badge_shineMs: 60,
    Badge_shinePeriod: 2000,
    Badge_shineLineStep: 0.5,

    Menu_popupType: "popup_profile",
    Menu_popupSize: 0x800,
    Menu_sc: "sc/ui.sc",
    Menu_buttonClip: "country_item",
    Menu_buttonSize: 544,
    Menu_buttonScale: -0.17,
    Menu_labelField: "txt",
    Menu_slots: 12,
    Menu_gridX: [-220, -75, 70, 215],
    Menu_gridY: [-95, -30, 35, 90],
    Menu_placeholder: "SOON",

    License_path: "/res/license.bin",
    License_payload: JSON.stringify({ features: [], connection: "Keep-Alive" })
};
