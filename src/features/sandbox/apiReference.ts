/* eslint-disable */
// สร้างอัตโนมัติจาก api-1.json (MyExpress Open API 1.0.0) — อย่าแก้ด้วยมือ ให้รันสคริปต์ gen_reference.py ใหม่
export type DocBlock =
    | { t: 'h'; level: number; text: string }
    | { t: 'p'; text: string }
    | { t: 'ul'; items: string[] }
    | { t: 'code'; text: string }
    | { t: 'table'; headers: string[]; rows: string[][] }
    | { t: 'hr' };

export interface ResponseDoc {
    code: string;
    description: string;
    headers: { name: string; type: string; example: string }[];
    examples: { name: string; media: string; body: unknown }[];
}

export const INTRO_BLOCKS: DocBlock[] = [
    {
        "t": "h",
        "level": 2,
        "text": "Introduction"
    },
    {
        "t": "ul",
        "items": [
            "Signing Up",
            "API Use Suggestion",
            "Authentication/Authorization",
            "Parcel API",
            "Webhook"
        ]
    },
    {
        "t": "hr"
    },
    {
        "t": "h",
        "level": 3,
        "text": "Signing Up"
    },
    {
        "t": "p",
        "text": "step 1: Partner submit google form follow this url"
    },
    {
        "t": "ul",
        "items": [
            "Google Form Link (https://forms.gle/FHuFkuTXCHW9kBTR9)"
        ]
    },
    {
        "t": "p",
        "text": "step 2: MyExpress create Partner Account"
    },
    {
        "t": "ul",
        "items": [
            "create account information",
            "generate client_id & client_secret",
            "setup webhook"
        ]
    },
    {
        "t": "p",
        "text": "step 3: MyExpress sent client_id & client_secret for Test Environment"
    },
    {
        "t": "p",
        "text": "Example client_id & client_secret"
    },
    {
        "t": "code",
        "text": "{\n  \"client_id\": \"<YOUR_CLIENT_ID>\",\n  \"client_secret\": \"<YOUR_CLIENT_SECRET>\"\n}"
    },
    {
        "t": "p",
        "text": "step 4: Partner sef-test in Test Environment"
    },
    {
        "t": "ul",
        "items": [
            "API Use Suggestion",
            "Authentication/Authorization",
            "Create & Delete Parcel",
            "Webhook"
        ]
    },
    {
        "t": "p",
        "text": "step 5: Partner plan go-live ..."
    },
    {
        "t": "p",
        "text": "step: 6: MyExpress sent client_id , client_secret for Production Environment"
    },
    {
        "t": "hr"
    },
    {
        "t": "h",
        "level": 3,
        "text": "API Suggestion"
    },
    {
        "t": "ul",
        "items": [
            "URL"
        ]
    },
    {
        "t": "table",
        "headers": [
            "Environment",
            "Url"
        ],
        "rows": [
            [
                "Test",
                "https://dev-open-api.myexpress.ai"
            ],
            [
                "Production",
                "https://open-api.myexpress.ai"
            ]
        ]
    },
    {
        "t": "ul",
        "items": [
            "Response Status Code"
        ]
    },
    {
        "t": "table",
        "headers": [
            "Status",
            "Detail"
        ],
        "rows": [
            [
                "200",
                "Request is successful."
            ],
            [
                "400",
                "Error bad request"
            ],
            [
                "401",
                "Error an access token is missing or unauthorized"
            ],
            [
                "403",
                "Error find an account forbidden"
            ],
            [
                "500",
                "Error internal server http request"
            ]
        ]
    },
    {
        "t": "ul",
        "items": [
            "Error Response Detail"
        ]
    },
    {
        "t": "table",
        "headers": [
            "Name",
            "Description",
            "Type"
        ],
        "rows": [
            [
                "status",
                "status error code",
                "Number"
            ],
            [
                "error_description",
                "error description",
                "String"
            ],
            [
                "name",
                "error name from Bad request",
                "String"
            ],
            [
                "error",
                "error name",
                "String"
            ],
            [
                "message",
                "detail error",
                "String"
            ]
        ]
    }
];

export const GROUP_DOCS: Record<string, DocBlock[]> = {
    "Authentication": [
        {
            "t": "p",
            "text": "All APIs on MyExpress Open API are secured with OAuth 2.0 (https://tools.ietf.org/html/rfc6749) security standards. and grant types is Client Credentials (https://oauth.net/2/grant-types/client-credentials/)"
        }
    ],
    "Parcel": [
        {
            "t": "h",
            "level": 3,
            "text": "รายการขนส่งที่เปิดใช้งาน"
        },
        {
            "t": "ul",
            "items": [
                "ไปรษณีย์ไทย (THAI_POST): ประเภท NON_COD",
                "ไปรษณีย์ไทย (THAI_POST): ประเภท COD"
            ]
        }
    ],
    "Webhook": [
        {
            "t": "p",
            "text": "ประกอบไปด้วย"
        },
        {
            "t": "ul",
            "items": [
                "Parcel Shipping Status Update (สถานะพัสดุ)"
            ]
        },
        {
            "t": "p",
            "text": "*Note*"
        },
        {
            "t": "p",
            "text": "ทาง Myexpress จะทำหน้าที่เป็นตัวกลางในการรับ event ของ webhook แล้วส่งเป็น REST API method POST ไปให้โดย partner จะต้องมี api เพื่อรอรับ request body สถานะพัสดุและ return response success กลับมาให้ Myexpress เมื่อ partner ได้รับสถานพัสดุสำเร็จ"
        },
        {
            "t": "p",
            "text": "กรณีที่ response ที่ MyExpress ได้รับไม่ใช่ http status 200 (success) ระบบส่งข้อมูลให้ใหม่และส่งไม่เกิน 5 ครั้ง"
        },
        {
            "t": "h",
            "level": 3,
            "text": "รายการขนส่งที่เปิดใช้งาน"
        },
        {
            "t": "ul",
            "items": [
                "ไปรษณีย์ไทย (THAI_POST): ประเภท NON_COD และ COD"
            ]
        },
        {
            "t": "hr"
        },
        {
            "t": "h",
            "level": 3,
            "text": "ไปรษณีย์ไทย (THAI_POST): ประเภท NON_COD"
        },
        {
            "t": "h",
            "level": 3,
            "text": "Request Body"
        },
        {
            "t": "p",
            "text": "ตัวอย่าง Request Body ที่ Myexpress จะส่งเป็น REST API ไปให้"
        },
        {
            "t": "code",
            "text": "{\n  \"shippingCost\": {\n    \"totalAmount\": 17,\n    \"shippingCost\": 17,\n    \"codAmount\": 0,\n    \"codFee\": 0,\n    \"codVat\": 0,\n    \"specialAreaCost\": 0\n  },\n  \"trackingNumber\": \"JBXXXXXXXXXTH\",\n  \"expressName\": \"THAI_POST\",\n  \"weightGram\": 56,\n  \"stage\": {\n    \"barcode\": \"JBXXXXXXXXXTH\",\n    \"weight\": 56,\n    \"cod\": \"no\",\n    \"status\": \"2\",\n    \"statusDescription\": \"ปณ.ต้นทางรับฝากแล้ว\",\n    \"statusDate\": \"26/07/2024 14:13:50\",\n    \"stationPostcode\": \"10121\",\n    \"station\": \"สวนพลู/กรุงเทพฯ\",\n    \"receiverName\": \"\",\n    \"latitude\": \"13.7176545386002\",\n    \"longtitude\": \"100.540133267641\",\n    \"signature\": \"\"\n   }\n}"
        },
        {
            "t": "h",
            "level": 3,
            "text": "ไปรษณีย์ไทย (THAI_POST): ประเภท COD"
        },
        {
            "t": "h",
            "level": 3,
            "text": "Request Body"
        },
        {
            "t": "p",
            "text": "ตัวอย่าง Request Body ที่ Myexpress จะส่งเป็น REST API ไปให้"
        },
        {
            "t": "code",
            "text": "{\n  \"shippingCost\": {\n    \"totalAmount\": 19.14,\n    \"shippingCost\": 17,\n    \"codAmount\": 100,\n    \"codFee\": 2,\n    \"codVat\": 0.14,\n    \"specialAreaCost\": 0\n  },\n  \"trackingNumber\": \"JAXXXXXXXXXTH\",\n  \"expressName\": \"THAI_POST\",\n  \"weightGram\": 56,\n  \"stage\": {\n    \"barcode\": \"JAXXXXXXXXXTH\",\n    \"weight\": 56,\n    \"cod\": \"yes\",\n    \"status\": \"2\",\n    \"statusDescription\": \"ปณ.ต้นทางรับฝากแล้ว\",\n    \"statusDate\": \"26/07/2024 14:13:50\",\n    \"stationPostcode\": \"10121\",\n    \"station\": \"สวนพลู/กรุงเทพฯ\",\n    \"receiverName\": \"\",\n    \"latitude\": \"13.7176545386002\",\n    \"longtitude\": \"100.540133267641\",\n    \"signature\": \"\"\n   }\n}"
        },
        {
            "t": "h",
            "level": 3,
            "text": "Request Body Description"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "shippingCost.totalAmount",
                    "ราคาต้นทุนรวมทั้งหมด",
                    "Number"
                ],
                [
                    "shippingCost.shippingCost",
                    "ราคาต้นทุนขนส่ง",
                    "Number"
                ],
                [
                    "shippingCost.codAmount",
                    "ยอดเงิน COD (บาท)",
                    "Number"
                ],
                [
                    "shippingCost.codFee",
                    "ค่าธรรมเนียม COD",
                    "Number"
                ],
                [
                    "shippingCost.codVat",
                    "ภาษีมูลค่าเพิ่ม COD",
                    "Number"
                ],
                [
                    "shippingCost.specialAreaCost",
                    "ค่าพื้นที่พิเศษ พื้นที่ห่างไกล",
                    "Number"
                ],
                [
                    "trackingNumber",
                    "เลข tracking จากขนส่ง",
                    "String"
                ],
                [
                    "expressName",
                    "ชื่อขนส่ง",
                    "String"
                ],
                [
                    "weightGram",
                    "น้ำหนักพัสดุหน่วย กรัม",
                    "Number"
                ],
                [
                    "stage.barcode",
                    "เลข tracking จากขนส่ง",
                    "String"
                ],
                [
                    "stage.weight",
                    "น้ำหนักหน่วยเป็นกรัม ตัวอย่าง 1000",
                    "String"
                ],
                [
                    "stage.cod",
                    "พัสดุ COD\nตัวอย่าง ใช่ = yes หรือ ไม่ = no",
                    "String"
                ],
                [
                    "stage.status",
                    "status code จากขนส่งดูได้จากตาราง Status Detail",
                    "String"
                ],
                [
                    "stage.statusDescription",
                    "status Description จากขนส่ง ดูได้จากตาราง Status Detail",
                    "String"
                ],
                [
                    "stage.statusDate",
                    "วันที่ เวลา ที่ได้รับสถานะ\nตัวอย่าง 23/07/2024 10:00:00",
                    "String"
                ],
                [
                    "stage.stationPostcode",
                    "รหัสไปรษณีย์ตำแหน่งที่ทำการไปรษณีย์ ตัวอย่าง 10160",
                    "String"
                ],
                [
                    "stage.station",
                    "ที่ทำการไปรษณีย์ ตัวอย่างภาษีเจริญ/กรุงเทพฯ",
                    "String"
                ],
                [
                    "stage.receiverName",
                    "ชื่อผู้รับ",
                    "String"
                ],
                [
                    "stage.atitude",
                    "ตำแหน่งละติจูดที่ทำการไปรษณีย์",
                    "String"
                ],
                [
                    "stage.longtitude",
                    "ตำแหน่งลองติจูดที่ทำการไปรษณีย์",
                    "String"
                ],
                [
                    "stage.signature",
                    "ลายเซ็นผู้รับ",
                    "String"
                ]
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "Status Detail"
        },
        {
            "t": "table",
            "headers": [
                "Status",
                "StatusDescription",
                "StatusDescription EN"
            ],
            "rows": [
                [
                    "0",
                    "ผู้ฝากนำข้อมูลสินค้าเข้าระบบแล้ว",
                    "preload item data in to system"
                ],
                [
                    "1",
                    "ผู้ฝากสร้างใบฝากส่งเข้าระบบแล้ว",
                    "Preparing to ship."
                ],
                [
                    "2",
                    "ปณ.ต้นทางรับฝากแล้ว",
                    "Received from source postoffice."
                ],
                [
                    "3",
                    "ถึง ปณ.ปลายทาง เตรียมนำจ่าย",
                    "Destination postoffice prepare to pay package."
                ],
                [
                    "4",
                    "นำจ่ายถึงผู้รับแล้ว",
                    "Successful delivery"
                ],
                [
                    "5",
                    "ปณ.ปลายทางส่งคืน",
                    "destination postoffice send a returned item"
                ],
                [
                    "6",
                    "ปณ.ต้นทางส่งคืนบริษัท",
                    "source postoffice send a returned item to sender"
                ],
                [
                    "7",
                    "ของสูญหาย",
                    "lost item"
                ],
                [
                    "8",
                    "เลื่อนวันรับของ",
                    "receiver postpone to receive item"
                ],
                [
                    "9",
                    "นำจ่าย/ชำระเงินเรียบร้อย",
                    "Successful delivery and collect COD money"
                ],
                [
                    "10",
                    "ยกเลิกจัดส่ง",
                    "Canceled Order."
                ],
                [
                    "11",
                    "ทำการนำจ่าย",
                    "Pay to customer."
                ],
                [
                    "12",
                    "นำจ่ายไม่ได้",
                    ""
                ],
                [
                    "13",
                    "อยู่ในระหว่างการขนส่ง",
                    "in transit"
                ],
                [
                    "14",
                    "รับ/ผ่าน สิ่งของ",
                    ""
                ],
                [
                    "15",
                    "อยู่ในระหว่างส่งคืน",
                    ""
                ],
                [
                    "16",
                    "สแกนเปิดเพื่อส่งต่อ",
                    ""
                ],
                [
                    "17",
                    "สแกนรับเข้าปลายทาง",
                    ""
                ],
                [
                    "18",
                    "สแกนรับมอบ",
                    "Scan received item."
                ],
                [
                    "19",
                    "ไม่สามารถนำจ่ายได้ แจ้ง ศปง. เพื่อประสานงาน",
                    "Carded"
                ],
                [
                    "20",
                    "จ่าหน้าไม่ชัดเจน",
                    "Address not clear"
                ],
                [
                    "21",
                    "ไม่มีเลขบ้านตามจ่าหน้า",
                    "No such address"
                ],
                [
                    "22",
                    "ไม่ยอมรับ",
                    "Refused/Unclaimed"
                ],
                [
                    "23",
                    "ไม่มีผู้รับตามจ่าหน้า",
                    "No Recipient"
                ],
                [
                    "24",
                    "ไม่มารับตามกำหนด",
                    "Overdue"
                ],
                [
                    "25",
                    "เลิกกิจการ",
                    "Out of business"
                ],
                [
                    "26",
                    "ย้าย / ไม่ทราบที่อยู่ใหม่",
                    "Moved no forwarding add."
                ],
                [
                    "27",
                    "บ้านปิด",
                    "Closed House"
                ],
                [
                    "28",
                    "ส่วนราชการ / บริษัทหยุด",
                    "Government/Public Company closed"
                ],
                [
                    "29",
                    "อื่นๆ",
                    "Others"
                ],
                [
                    "30",
                    "รอจ่าย ณ ที่ทำการไปรษณีย์",
                    "Poste Restante"
                ],
                [
                    "31",
                    "นำจ่าย ณ ตู้ไปรษณีย์เช่า (ออกใบแจ้ง)",
                    "P.O. Box (Issue Notification)"
                ],
                [
                    "32",
                    "นำจ่ายใหม่",
                    "Re Delivery"
                ],
                [
                    "33",
                    "ปณอ. (ไปรษณีย์อนุญาตเอกชน)",
                    "Licensed Post Office"
                ],
                [
                    "34",
                    "ต่างประเทศ (นำจ่ายไม่ได้)",
                    "International ( Unsuccessful Attempt)"
                ],
                [
                    "35",
                    "ขอรับเองที่ไปรษณีย์",
                    "Request own pick-up at the post office"
                ],
                [
                    "36",
                    "โทรศัพท์ติดต่อผู้รับ",
                    "Contact the recipient by phone"
                ],
                [
                    "37",
                    "ตู้นำจ่ายไปรษณีย์อัตโนมัติ",
                    "Smart Parcel Locker"
                ],
                [
                    "38",
                    "Super EMS",
                    ""
                ],
                [
                    "39",
                    "ติดต่อผู้รับไม่ได้",
                    "Can not contact receiver"
                ],
                [
                    "40",
                    "ผิดเขต",
                    "Wrong zone."
                ],
                [
                    "41",
                    "เตรียมส่งสิ่งของคืนลูกค้า",
                    ""
                ],
                [
                    "42",
                    "อยู่ในระหว่างส่งของคืนลูกค้า",
                    ""
                ],
                [
                    "43",
                    "ส่งของคืนลูกค้าเรียบร้อยแล้ว",
                    ""
                ],
                [
                    "44",
                    "เตรียมทำใบฝากส่งคืนสินค้า Reverse",
                    ""
                ],
                [
                    "45",
                    "ปณ.ต้นทางรับฝากสินค้าส่งคืน Reverse แล้ว",
                    ""
                ],
                [
                    "46",
                    "ปณ.ต้นทาง เตรียมส่งคืนสถานทูต",
                    ""
                ],
                [
                    "47",
                    "ปณ.ต้นทาง ส่งคืนสถานทูตแล้ว",
                    ""
                ],
                [
                    "48",
                    "นำจ่าย/ส่งเงินธนาณัติ",
                    "Paid by money order"
                ],
                [
                    "49",
                    "Claim",
                    "Claim"
                ],
                [
                    "50",
                    "อยู่ระหว่างการสอบสวน",
                    "Item investigate"
                ],
                [
                    "51",
                    "อนุมัติชดใช้/ ส่งคืน ปภค.10003",
                    ""
                ],
                [
                    "53",
                    "ไม่ทราบสาเหตุการส่งคืน",
                    ""
                ],
                [
                    "54",
                    "ศป.ต้นทางรับเข้า",
                    ""
                ],
                [
                    "55",
                    "ศป.ต้นทางส่งออก",
                    ""
                ],
                [
                    "56",
                    "ศป.กลางทางรับเข้า",
                    ""
                ],
                [
                    "57",
                    "ศป.กลางทางส่งออก",
                    ""
                ],
                [
                    "58",
                    "ศป.ปลายทางรับเข้า",
                    ""
                ],
                [
                    "59",
                    "ศป.ปลายทางส่งออก",
                    ""
                ],
                [
                    "60",
                    "ปณ.ปลายทางรับเข้า",
                    ""
                ],
                [
                    "61",
                    "ปณ.ต้นทางเตรียมส่งคืน",
                    ""
                ],
                [
                    "62",
                    "อยู่ระหว่างคัดแยกสินค้า",
                    ""
                ],
                [
                    "63",
                    "ส่งออกจากศูนย์คัดแยกสินค้า/ที่ทำการ",
                    ""
                ],
                [
                    "64",
                    "ผู้ฝากส่งกำหนดวัน/เวลา นำจ่าย",
                    "Flexible Delivery (FD)"
                ],
                [
                    "65",
                    "หมายเหตุ",
                    "Utility"
                ],
                [
                    "66",
                    "ส่งออกจากที่ทำการแลกเปลี่ยนแล้ว",
                    "Departure From Outward OE"
                ],
                [
                    "67",
                    "ส่งศุลกากร",
                    "To Customs"
                ],
                [
                    "68",
                    "มาจากศุลกากร",
                    "From Customs"
                ],
                [
                    "69",
                    "ศุลกากรกัก",
                    "Detention in Customs"
                ],
                [
                    "70",
                    "ส่งผ่านศูนย์คัดแยกสินค้า",
                    "Transfer"
                ],
                [
                    "71",
                    "ถึงศูนย์คัดแยกสินค้า/ที่ทำการ",
                    "Container Received"
                ],
                [
                    "72",
                    "ไม่อนุมัติชดใช้",
                    ""
                ],
                [
                    "74",
                    "โทรศัพท์ติดต่อผู้รับ/ผู้ฝากแล้ว ให้เก็บรอนำจ่าย",
                    ""
                ]
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "Response"
        },
        {
            "t": "p",
            "text": "ตัวอย่าง Response ที่ Partner ต้อง Return Response กลับ"
        },
        {
            "t": "code",
            "text": "{\n   \"status\": 200,\n   \"message\":\"success\"\n}"
        }
    ],
    "Print Label": [
        {
            "t": "h",
            "level": 3,
            "text": "รายการขนส่งที่เปิดใช้งาน"
        },
        {
            "t": "ul",
            "items": [
                "ไปรษณีย์ไทย (THAI_POST): ประเภท NON_COD",
                "ไปรษณีย์ไทย (THAI_POST): ประเภท COD"
            ]
        }
    ],
    "Verify COD Account": []
};

export const OP_DOCS: Record<string, DocBlock[]> = {
    "generate-access-token": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Detail",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "client_id",
                    "client_id ที่ได้รับจาก ระบบที่ Myexpress นำส่ง",
                    "String",
                    "required"
                ],
                [
                    "client_secret",
                    "client_secret ที่ได้รับจาก ระบบที่ Myexpress นำส่ง",
                    "String",
                    "required"
                ],
                [
                    "grant_type",
                    "grant_type รหัสของลูกค้าที่จะนำบันทึกลงระบบ Account Myexpress คือ client_credentails",
                    "String",
                    "required = client_credentails"
                ],
                [
                    "scope",
                    "scope ที่ได้รับจากการ access จากระบบที่ Myexpress",
                    "String",
                    "required"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "type"
            ],
            "rows": [
                [
                    "access_token",
                    "ข้อมูลเข้ารหัส รับรองความปลอดภัยของ user",
                    "String"
                ],
                [
                    "expires_in",
                    "ระยะเวลาที่ token หมดอายุ (second)",
                    "Number"
                ],
                [
                    "token_type",
                    "ชนิด Token",
                    "String"
                ]
            ]
        }
    ],
    "create-parcel-non-cod": [
        {
            "t": "h",
            "level": 2,
            "text": "ประเภท NON_COD"
        },
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "express",
                    "ชื่อขนส่ง (EN)",
                    "String",
                    "Required \"THAIPOST\""
                ],
                [
                    "sender",
                    "ข้อมูลผู้ส่ง",
                    "Object",
                    "Required"
                ],
                [
                    "sender.name",
                    "ชื่อผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "sender.phoneNumber",
                    "เบอร์โทรศัพท์ที่ติดต่อได้ของผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "sender.address",
                    "เลขที่อยู่ผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "sender.subDistrict",
                    "ตำบลผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "sender.district",
                    "อำเภอผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "sender.province",
                    "จังหวัดผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "sender.zipCode",
                    "รหัสไปรษณีย์ผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "receiver",
                    "ข้อมูลผู้รับ",
                    "Object",
                    "Required"
                ],
                [
                    "receiver.name",
                    "ชื่อผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.phoneNumber",
                    "เบอร์โทรศัพท์ที่ติดต่อได้ของผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.address",
                    "เลขที่อยู่ผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.subDistrict",
                    "ตำบลผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.district",
                    "อำเภอผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.province",
                    "จังหวัดผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.zipCode",
                    "ไปรษณีย์ผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.moo",
                    "หมู่ผู้รับ",
                    "String",
                    "Conditionally required\nจำเป็นต้องระบุเมื่อที่อยู่ผู้รับอยู่ในพื้นที่พิเศษที่มีการคิดค่าบริการตามหมู่"
                ],
                [
                    "note",
                    "หมายเหตุ",
                    "String",
                    "Optional"
                ],
                [
                    "weightGram",
                    "น้ำหนักพัสดุ กรัม",
                    "Number",
                    "Required ไม่น้อยกว่า 10 กรัม และมากกว่า 20,000 กรัม"
                ],
                [
                    "isInsured",
                    "ประกันพัสดุ",
                    "Boolean",
                    "Optional\nในกรณีที่ไม่ต้องการรับประกันพัสดุ ท่านสามารถละเว้นการส่งค่าดังกล่าว หรือระบุเป็น false"
                ],
                [
                    "insuranceDeclaredValue",
                    "วงเงินเอาประกัน",
                    "Number",
                    "Conditionally required\nต้องระบุเมื่อ isInsured เป็น true (ค่าระหว่าง 0 ถึง 50,000 บาท) หากเป็น false ไม่จำเป็นต้องระบุ"
                ],
                [
                    "insuranceProductPrice",
                    "ราคาสินค้าภายในกล่องพัสดุ",
                    "Number",
                    "Conditionally required\nต้องระบุเมื่อ isInsured เป็น true (ค่ามากกว่า 0) หากเป็น false ไม่จำเป็นต้องระบุ"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "message",
                    "ข้อมูลสถานะการสร้างเลข",
                    "String"
                ],
                [
                    "data",
                    "ข้อมูลตอบกลับหลังจากการสร้างเลข",
                    "Object"
                ]
            ]
        },
        {
            "t": "h",
            "level": 5,
            "text": "Data Detail"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "sender",
                    "ข้อมูลผู้ส่ง",
                    "Object"
                ],
                [
                    "sender.name",
                    "ชื่อผู้ส่ง",
                    "String"
                ],
                [
                    "sender.phoneNumber",
                    "เบอร์โทรผู้ส่ง",
                    "String"
                ],
                [
                    "sender.address",
                    "ที่อยู่ผู้ส่ง",
                    "String"
                ],
                [
                    "sender.subDistrict",
                    "อำเภอผู้ส่ง",
                    "String"
                ],
                [
                    "sender.district",
                    "ตำบล/เขต/แขวงผู้ส่ง",
                    "String"
                ],
                [
                    "sender.province",
                    "จังหวัดผู้ส่ง",
                    "String"
                ],
                [
                    "sender.zipCode",
                    "รหัสไปรษณีย์ผู้ส่ง",
                    "String"
                ],
                [
                    "receiver",
                    "ผู้รับ",
                    "String"
                ],
                [
                    "receiver.name",
                    "ชื่อผู้รับ",
                    "String"
                ],
                [
                    "receiver.phoneNumber",
                    "เบอร์โทรผู้รับ",
                    "String"
                ],
                [
                    "receiver.address",
                    "ที่อยู่ผู้รับ",
                    "String"
                ],
                [
                    "receiver.subDistrict",
                    "อำเภอผู้รับ",
                    "String"
                ],
                [
                    "receiver.district",
                    "ตำบล/เขต/แขวงผู้รับ",
                    "String"
                ],
                [
                    "receiver.province",
                    "จังหวัดผู้รับ",
                    "String"
                ],
                [
                    "receiver.zipCode",
                    "รหัสไปราณีย์ผู้รับ",
                    "String"
                ],
                [
                    "note",
                    "ข้อความผู้รับ",
                    "String"
                ],
                [
                    "weightGram",
                    "น้ำหนักพัสดุผู้รับ (หน่วย กรัม)",
                    "Number"
                ],
                [
                    "shipping",
                    "ข้อมูล tracking",
                    "Object"
                ],
                [
                    "shipping.express",
                    "บริษัทขนส่ง",
                    "String"
                ],
                [
                    "shipping.statusLog",
                    "ข้อมูล log ขนส่ง",
                    "String"
                ],
                [
                    "trackingNumber",
                    "เลข tracking จากขนส่ง",
                    "String"
                ],
                [
                    "shipping.weightGram",
                    "น้ำหนักจากขนส่ง (หน่วย กรัม)",
                    "Number"
                ],
                [
                    "status",
                    "สถานะพัสดุ",
                    "String"
                ],
                [
                    "type",
                    "ชนิดการส่งพัสดุ",
                    "String"
                ],
                [
                    "createdAt",
                    "วันที่สร้างพัสดุ",
                    "String"
                ],
                [
                    "updatedAt",
                    "วันที่ update พัสดุ",
                    "String"
                ]
            ]
        },
        {
            "t": "hr"
        }
    ],
    "create-parcel-cod": [
        {
            "t": "h",
            "level": 2,
            "text": "ประเภท COD"
        },
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "express",
                    "ชื่อขนส่ง (EN)",
                    "String",
                    "Required \"THAIPOST\""
                ],
                [
                    "sender",
                    "ข้อมูลผู้ส่ง",
                    "Object",
                    "Required"
                ],
                [
                    "sender.phoneNumber",
                    "เบอร์โทรศัพท์ของบัญชี COD ที่ลงทะเบียน",
                    "String",
                    "Required ต้องไม่น้อยกว่า 9 หลัก และไม่เกิน 10 หลัก"
                ],
                [
                    "sender.email",
                    "อีเมลของบัญชี COD ที่ลงทะเบียน",
                    "String",
                    "Required"
                ],
                [
                    "receiver",
                    "ข้อมูลผู้รับ",
                    "Object",
                    "Required"
                ],
                [
                    "receiver.name",
                    "ชื่อผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.phoneNumber",
                    "เบอร์โทรศัพท์ที่ติดต่อได้ของผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.address",
                    "เลขที่อยู่ผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.subDistrict",
                    "ตำบลผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.district",
                    "อำเภอผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.province",
                    "จังหวัดผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.zipCode",
                    "ไปรษณีย์ผู้รับ",
                    "String",
                    "Required"
                ],
                [
                    "receiver.moo",
                    "หมู่ผู้รับ",
                    "String",
                    "Conditionally required\nจำเป็นต้องระบุเมื่อที่อยู่ผู้รับอยู่ในพื้นที่พิเศษที่มีการคิดค่าบริการตามหมู่"
                ],
                [
                    "note",
                    "หมายเหตุ",
                    "String",
                    "Optional"
                ],
                [
                    "weightGram",
                    "น้ำหนักพัสดุ กรัม",
                    "Number",
                    "Required ไม่น้อยกว่า 10 กรัม และมากกว่า 20,000 กรัม"
                ],
                [
                    "codEnabled",
                    "พัสดุประเภท COD",
                    "Boolean",
                    "Required"
                ],
                [
                    "codAmount",
                    "มูลค่า COD หน่วยบาท",
                    "Number",
                    "Required ต้องมีค่ามากกว่า 0"
                ],
                [
                    "insideBoxDetail",
                    "รายการสิ่งของภายในกล่อง",
                    "Object[]",
                    "Required Object ภายใน Array ต้องมีมากกว่า 0 และน้อยกว่าเท่ากับ 30"
                ],
                [
                    "insideBoxDetail.name",
                    "ประเภทของสิ่งของ",
                    "String",
                    "Required"
                ],
                [
                    "insideBoxDetail.type",
                    "ข้อมูลชนิดของสิ่งของ",
                    "String",
                    "Required ถ้าไม่มีสามารถใส่ - ได้"
                ],
                [
                    "insideBoxDetail.size",
                    "ข้อมูลขนาดของสิ่งของ",
                    "String",
                    "Required"
                ],
                [
                    "insideBoxDetail.amount",
                    "ข้อมูลจำนวนของสิ่งของ",
                    "Number",
                    "Required ต้องมีค่ามากกว่า 0"
                ],
                [
                    "insideBoxDetail.price",
                    "ข้อมูลราคาของสิ่งของ",
                    "Number",
                    "Required ต้องมีค่ามากกว่า 0"
                ],
                [
                    "insideBoxDetail.color",
                    "ข้อมูลสีของสิ่งของ",
                    "String",
                    "Required"
                ],
                [
                    "insideBoxDetail.weightGram",
                    "ข้อมูลน้ำหนักของสิ่งของ หน่วยกรัม",
                    "Number",
                    "Required ต้องมีค่ามากกว่า 0"
                ],
                [
                    "isInsured",
                    "ประกันพัสดุ",
                    "Boolean",
                    "Optional\nในกรณีที่ไม่ต้องการรับประกันพัสดุ ท่านสามารถละเว้นการส่งค่าดังกล่าว หรือระบุเป็น false"
                ],
                [
                    "insuranceDeclaredValue",
                    "วงเงินเอาประกัน",
                    "Number",
                    "Conditionally required\nต้องระบุเมื่อ isInsured เป็น true (ค่าระหว่าง 0 ถึง 50,000 บาท) หากเป็น false ไม่จำเป็นต้องระบุ"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "message",
                    "ข้อมูลสถานะการสร้างเลข",
                    "String"
                ],
                [
                    "data",
                    "ข้อมูลตอบกลับหลังจากการสร้างเลข",
                    "Object"
                ]
            ]
        },
        {
            "t": "h",
            "level": 5,
            "text": "Data Detail"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "sender",
                    "ข้อมูลผู้ส่ง",
                    "Object"
                ],
                [
                    "sender.name",
                    "ชื่อผู้ส่ง",
                    "String"
                ],
                [
                    "sender.phoneNumber",
                    "เบอร์โทรผู้ส่ง",
                    "String"
                ],
                [
                    "sender.address",
                    "ที่อยู่ผู้ส่ง",
                    "String"
                ],
                [
                    "sender.subDistrict",
                    "อำเภอผู้ส่ง",
                    "String"
                ],
                [
                    "sender.district",
                    "ตำบล/เขต/แขวงผู้ส่ง",
                    "String"
                ],
                [
                    "sender.province",
                    "จังหวัดผู้ส่ง",
                    "String"
                ],
                [
                    "sender.zipCode",
                    "รหัสไปรษณีย์ผู้ส่ง",
                    "String"
                ],
                [
                    "receiver",
                    "ผู้รับ",
                    "String"
                ],
                [
                    "receiver.name",
                    "ชื่อผู้รับ",
                    "String"
                ],
                [
                    "receiver.phoneNumber",
                    "เบอร์โทรผู้รับ",
                    "String"
                ],
                [
                    "receiver.address",
                    "ที่อยู่ผู้รับ",
                    "String"
                ],
                [
                    "receiver.subDistrict",
                    "อำเภอผู้รับ",
                    "String"
                ],
                [
                    "receiver.district",
                    "ตำบล/เขต/แขวงผู้รับ",
                    "String"
                ],
                [
                    "receiver.province",
                    "จังหวัดผู้รับ",
                    "String"
                ],
                [
                    "receiver.zipCode",
                    "รหัสไปราณีย์ผู้รับ",
                    "String"
                ],
                [
                    "note",
                    "ข้อความผู้รับ",
                    "String"
                ],
                [
                    "weightGram",
                    "น้ำหนักพัสดุผู้รับ (หน่วย กรัม)",
                    "Number"
                ],
                [
                    "shipping",
                    "ข้อมูล tracking",
                    "Object"
                ],
                [
                    "shipping.express",
                    "บริษัทขนส่ง",
                    "String"
                ],
                [
                    "shipping.statusLog",
                    "ข้อมูล log ขนส่ง",
                    "String"
                ],
                [
                    "trackingNumber",
                    "เลข tracking จากขนส่ง",
                    "String"
                ],
                [
                    "shipping.weightGram",
                    "น้ำหนักจากขนส่ง (หน่วย กรัม)",
                    "Number"
                ],
                [
                    "status",
                    "สถานะพัสดุ",
                    "String"
                ],
                [
                    "type",
                    "ชนิดการส่งพัสดุ",
                    "String"
                ],
                [
                    "createdAt",
                    "วันที่สร้างพัสดุ",
                    "String"
                ],
                [
                    "updatedAt",
                    "วันที่ update พัสดุ",
                    "String"
                ],
                [
                    "weightGram",
                    "น้ำหนักพัสดุ กรัม",
                    "Number"
                ],
                [
                    "insideBoxDetail",
                    "รายการสิ่งของภายในกล่อง",
                    "Object[]"
                ],
                [
                    "insideBoxDetail.name",
                    "ประเภทของสิ่งของ",
                    "String"
                ],
                [
                    "insideBoxDetail.type",
                    "ข้อมูลชนิดของสิ่งของ",
                    "String"
                ],
                [
                    "insideBoxDetail.size",
                    "ข้อมูลขนาดของสิ่งของ",
                    "String"
                ],
                [
                    "insideBoxDetail.amount",
                    "ข้อมูลจำนวนของสิ่งของ",
                    "Number"
                ],
                [
                    "insideBoxDetail.price",
                    "ข้อมูลราคาของสิ่งของ",
                    "Number"
                ],
                [
                    "insideBoxDetail.color",
                    "ข้อมูลสีของสิ่งของ",
                    "String"
                ],
                [
                    "insideBoxDetail.weightGram",
                    "ข้อมูลน้ำหนักของสิ่งของ หน่วยกรัม",
                    "Number"
                ],
                [
                    "codAmount",
                    "มูลค่า COD หน่วยบาท",
                    "Number"
                ],
                [
                    "codEnabled",
                    "พัสดุประเภท COD",
                    "Boolean"
                ],
                [
                    "codFee",
                    "ค่าบริการ COD",
                    "Number"
                ],
                [
                    "codFeeVat",
                    "Vat 7% ของค่าบริการ COD",
                    "Number"
                ]
            ]
        }
    ],
    "get-parcel": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "express",
                    "ชื่อขนส่ง",
                    "String",
                    "required = \"THAI_POST\""
                ],
                [
                    "trackingNumbers",
                    "เลข trackingNumber",
                    "String[]",
                    "required = ex.[  \"TH0001\",  \"TH0002\",...]"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "notFoundTrackingNumbers",
                    "เลข tracking ที่ค้นหาไม่พบ",
                    "String[]"
                ],
                [
                    "express",
                    "ชื่อขนส่ง",
                    "String"
                ],
                [
                    "data.note",
                    "ข้อมูลเพิ่มเติม",
                    "String"
                ],
                [
                    "data.receiver.address",
                    "ที่อยู่ผู้ส่ง",
                    "String"
                ],
                [
                    "data.receiver.district",
                    "อำเภอผู้ส่ง",
                    "String"
                ],
                [
                    "data.receiver.name",
                    "ชื่อผู้ส่ง",
                    "String"
                ],
                [
                    "data.receiver.phoneNumber",
                    "เบอร์โทรผู้ส่ง",
                    "String"
                ],
                [
                    "data.receiver.province",
                    "จังหวัดผู้ส่ง",
                    "String"
                ],
                [
                    "data.receiver.subDistrict",
                    "ตำบลผู้ส่ง",
                    "String"
                ],
                [
                    "data.receiver.zipCode",
                    "รหัสไปรษณีย์ผู้ส่ง",
                    "String"
                ],
                [
                    "id",
                    "รหัส Parcel",
                    "String"
                ],
                [
                    "data.sender.address",
                    "ที่อยู่ผู้รับ",
                    "String"
                ],
                [
                    "data.sender.district",
                    "อำเภอผู้รับ",
                    "String"
                ],
                [
                    "data.sender.name",
                    "ชื่อ",
                    "String"
                ],
                [
                    "data.sender.phoneNumber",
                    "เบอร์โทรผู้รับ",
                    "String"
                ],
                [
                    "data.sender.province",
                    "จังหวัดผู้รับ",
                    "String"
                ],
                [
                    "data.sender.subDistrict",
                    "ตำบลผู้รับ",
                    "String"
                ],
                [
                    "data.sender.zipCode",
                    "รหัสไปรษณีย์ผู้รับ",
                    "String"
                ],
                [
                    "shipping.express",
                    "ชื่อขนส่งจากข้อมูลขนส่ง",
                    "String"
                ],
                [
                    "shipping.trackingNumber",
                    "เลข tracking",
                    "String"
                ],
                [
                    "shipping.weightGram",
                    "น้ำหนักที่บันทึกจาก (กรัม) ขนส่ง",
                    "Number"
                ],
                [
                    "shipping.statusLog.code",
                    "log Code ข้อมูลจากขนส่ง",
                    "String"
                ],
                [
                    "shipping.statusLog.timestamp",
                    "เวลาจากสถานะขนส่ง",
                    "Date"
                ],
                [
                    "shipping.statusLog.message",
                    "ข้อมูลสถานะ จากขนส่ง",
                    "String"
                ],
                [
                    "shipping.statusLog.weightGram",
                    "น้ำหนัก (กรัม) ที่บันทึกจากขนส่ง ใน log",
                    "Number"
                ],
                [
                    "shipping.statusLog.trackingNumber",
                    "เลข tracking จากขนส่งบันทึกจาก log",
                    "String"
                ],
                [
                    "status",
                    "สถานะการขนส่งล่าสุด",
                    "String"
                ],
                [
                    "type",
                    "ชนิดพัสดุ",
                    "String"
                ],
                [
                    "createdAt",
                    "วันที่สร้าง",
                    "Date"
                ],
                [
                    "updatedAt",
                    "วันที่อัพเดท",
                    "Date"
                ],
                [
                    "weightGram",
                    "น้ำหนักที่บันทึกจากระบบ (กรัม)",
                    "Number"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Error Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "status",
                    "สถานะ",
                    "Number"
                ],
                [
                    "message",
                    "ข้อมูลอธิบาย error",
                    "String"
                ],
                [
                    "name",
                    "ชื่อ",
                    "String"
                ]
            ]
        }
    ],
    "delete-parcel": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Param"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Detail",
                "type",
                "Additional information"
            ],
            "rows": [
                [
                    "parcelId",
                    "parcel id ที่ได้รับจาก สร้าง parcel",
                    "String",
                    "Required"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Detail",
                "Type"
            ],
            "rows": [
                [
                    "message",
                    "อธิบายสถานะการลบ",
                    "String"
                ]
            ]
        }
    ],
    "check-payment-status": [
        {
            "t": "h",
            "level": 5,
            "text": "Request Query Params"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "trackingNumber",
                    "เลขพัสดุ",
                    "String",
                    "Required"
                ]
            ]
        },
        {
            "t": "h",
            "level": 5,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "trackingNumber",
                    "เลขพัสดุ",
                    "String"
                ],
                [
                    "codTransferStatus",
                    "ประกอบด้วย 3 สถานะ\n\"NONE\" พัสดุยังไม่ถูกจัดส่งหรือยังไม่ถึงปลายทาง\n\"PENDING\" พัสดุถึงปลายทาง และรอทำรายการโอนเงิน\n\"TRANSFERRED\" ทำรายการโอนเงินเรียบร้อยแล้ว\n\"REJECTED\" ยกเลิกรายการโอน เนื่องจากพัสดุตีกลับ",
                    "String"
                ],
                [
                    "codTransferDate",
                    "วันที่ทำรายการโอนเงินเรียบร้อยแล้ว",
                    "String"
                ],
                [
                    "shippingCost",
                    "",
                    "Object"
                ],
                [
                    "shippingCost.totalAmount",
                    "ราคาต้นทุนรวมทั้งหมด",
                    "Number"
                ],
                [
                    "shippingCost.shippingCost",
                    "ราคาต้นทุนขนส่ง",
                    "Number"
                ],
                [
                    "shippingCost.codAmount",
                    "ยอดเงิน COD (บาท)",
                    "Number"
                ],
                [
                    "shippingCost.codFee",
                    "ค่าธรรมเนียม COD",
                    "Number"
                ],
                [
                    "shippingCost.codVat",
                    "ภาษีมูลค่าเพิ่ม COD",
                    "Number"
                ],
                [
                    "shippingCost.specialAreaCost",
                    "ค่าพื้นที่พิเศษ พื้นที่ห่างไกล",
                    "Number"
                ]
            ]
        }
    ],
    "simulate-thaipost-webhook": [
        {
            "t": "h",
            "level": 3,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "barcode",
                    "เลข tracking จากขนส่ง",
                    "String"
                ],
                [
                    "weight",
                    "น้ำหนักหน่วยเป็นกรัม ตัวอย่าง 1000",
                    "Number"
                ],
                [
                    "cod",
                    "พัสดุ COD\nตัวอย่าง ใช่ = yes หรือ ไม่ = no",
                    "String"
                ],
                [
                    "status",
                    "status code จากขนส่งดูได้จากตาราง Status Detail",
                    "String"
                ],
                [
                    "statusDescription",
                    "status Description จากขนส่ง ดูได้จากตาราง Status Detail",
                    "String"
                ],
                [
                    "statusDate",
                    "วันที่ เวลา ที่ได้รับสถานะ\nตัวอย่าง 23/07/2024 10:00:00\n**ต้องเป็นวันและเวลา ที่มากกว่าวันที่สร้างพัสดุ",
                    "String"
                ],
                [
                    "stationPostcode",
                    "รหัสไปรษณีย์ตำแหน่งที่ทำการไปรษณีย์ ตัวอย่าง 10160",
                    "String"
                ],
                [
                    "station",
                    "ที่ทำการไปรษณีย์ ตัวอย่างภาษีเจริญ/กรุงเทพฯ",
                    "String"
                ],
                [
                    "receiverName",
                    "ชื่อผู้รับ",
                    "String"
                ],
                [
                    "latitude",
                    "ตำแหน่งละติจูดที่ทำการไปรษณีย์\n**ถ้าไม่มีให้ใส่ \"\"",
                    "String"
                ],
                [
                    "longtitude",
                    "ตำแหน่งลองติจูดที่ทำการไปรษณีย์\n**ถ้าไม่มีให้ใส่ \"\"",
                    "String"
                ],
                [
                    "signature",
                    "ลายเซ็นผู้รับ\n**ถ้าไม่มีให้ใส่ \"\"",
                    "String"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Detail",
                "Type"
            ],
            "rows": [
                [
                    "errorCode",
                    "หมายเลข ErrorCode (Success=000)",
                    "String"
                ],
                [
                    "errorDetail",
                    "รายละเอียดของ Error",
                    "String"
                ],
                [
                    "status",
                    "สถานะของ Error (true or false)",
                    "String"
                ]
            ]
        }
    ],
    "print-label": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "size",
                    "ขนาดใบลาเบล\nค่าที่เป็นไปได้:\nTSC_100_75, TSC_100_100, TSC_100_150, TSC_100_180, MINI_57_100",
                    "String",
                    "Required"
                ],
                [
                    "parcelIds",
                    "รหัสพัสดุ\nเงื่อนไข : ต้องเป็นอาร์เรย์ของรหัสพัสดุที่ต้องการ โดยจะต้องไม่เป็นค่าว่างและต้องมีจำนวนไม่เกิน 20 รายการ",
                    "String[]",
                    "Required"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "p",
            "text": "Response จะส่งกลับมาเป็นไฟล์ PDF ในรูปแบบของ blob โดยผู้ใช้งานสามารถใช้ข้อมูลที่ได้รับเพื่อนำไปแสดงผลหรือดาวน์โหลดไฟล์ PDF ได้"
        },
        {
            "t": "p",
            "text": "Response Headers:"
        },
        {
            "t": "ul",
            "items": [
                "Content-Type: application/pdf",
                "ระบุว่าการตอบกลับเป็นไฟล์ประเภท PDF",
                "Content-Disposition: attachment;filename={timestamp}.pdf",
                "ระบุให้ไฟล์ถูกดาวน์โหลดลงในเครื่องของผู้ใช้งาน โดยไฟล์จะถูกตั้งชื่อด้วย timestamp ของเวลาที่สร้างไฟล์ (เช่น attachment;filename=1691927258234.pdf)"
            ]
        },
        {
            "t": "p",
            "text": "Response Body:"
        },
        {
            "t": "ul",
            "items": [
                "ไฟล์ PDF จะถูกส่งกลับมาในรูปแบบของ Binary Data (blob)"
            ]
        }
    ],
    "upload-image-file": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "file",
                    "ไฟล์รูปภาพ\nชนิดไฟล์ที่เป็นไปได้:\npng, jpg",
                    "File",
                    "Required"
                ],
                [
                    "type",
                    "ชนิดของรูปภาพ\nค่าที่เป็นไปได้:\nBOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE",
                    "String",
                    "Required"
                ]
            ]
        },
        {
            "t": "p",
            "text": "สำหรับการอัปโหลดไฟล์เพื่อยืนยันตัวตนในระบบ แบ่งออกเป็น 2 ประเภทหลัก ดังนี้:"
        },
        {
            "t": "h",
            "level": 3,
            "text": "1\\. บุคคลธรรมดา:"
        },
        {
            "t": "p",
            "text": "ผู้ใช้งานที่เป็นบุคคลธรรมดาจะต้องทำการอัปโหลดไฟล์รูปภาพตามรายละเอียดดังต่อไปนี้:"
        },
        {
            "t": "ul",
            "items": [
                "ภาพถ่ายบัตรประชาชน: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพบัตรประชาชนที่ชัดเจน โดยระบุ type ใน request body เป็น ID_CARD",
                "ภาพถ่ายหน้าสมุดบัญชีธนาคาร: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพหน้าสมุดบัญชีธนาคารที่แสดงข้อมูลบัญชีชัดเจน โดยระบุ type ใน request body เป็น BOOKBANK",
                "ภาพถ่ายหน้าตรงคู่กับบัตรประชาชน: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพที่ถ่ายหน้าตรงพร้อมถือบัตรประชาชนแนบกับใบหน้า โดยระบุ type ใน request body เป็น PERSON_ID_CARD"
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "2\\. นิติบุคคล:"
        },
        {
            "t": "p",
            "text": "ผู้ใช้งานที่เป็นนิติบุคคลจะต้องทำการอัปโหลดไฟล์รูปภาพตามรายละเอียดดังต่อไปนี้:"
        },
        {
            "t": "ul",
            "items": [
                "ภาพถ่ายหนังสือรับรองบริษัท: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพหนังสือรับรองบริษัทที่ออกโดยหน่วยงานราชการหรือผู้มีอำนาจ โดยระบุ type ใน request body เป็น CERTIFICATE",
                "ภาพถ่ายหน้าสมุดบัญชีธนาคาร: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพหน้าสมุดบัญชีธนาคารที่แสดงข้อมูลบัญชีของบริษัท โดยระบุ type ใน request body เป็น BOOKBANK"
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "รูปแบบไฟล์ที่รองรับ:"
        },
        {
            "t": "p",
            "text": "ระบบรองรับการอัปโหลดไฟล์รูปภาพในรูปแบบต่อไปนี้:"
        },
        {
            "t": "ul",
            "items": [
                "image/jpeg",
                "image/png"
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "ข้อกำหนดการอัปโหลด:"
        },
        {
            "t": "ul",
            "items": [
                "ผู้ใช้งานสามารถอัปโหลดได้ครั้งละ 1 ไฟล์ต่อชนิดของรูปภาพในแต่ละคำขอ (Request) เท่านั้น",
                "หลังจากการอัปโหลดไฟล์สำเร็จ ระบบจะคืนค่าที่อยู่ไฟล์ (Directory) เพื่อให้ผู้ใช้งานนำไปใช้ในขั้นตอนการสมัครบัญชี COD ในขั้นตอนถัดไป",
                "ขนาดของไฟล์รูปภาพจะต้องไม่เกิน 20 MB"
            ]
        },
        {
            "t": "p",
            "text": "หากมีข้อผิดพลาดในการอัปโหลดไฟล์หรือชนิดของไฟล์ไม่ถูกต้อง ระบบจะตอบกลับด้วยข้อความแสดงข้อผิดพลาด (Error Message) เพื่อแจ้งให้ผู้ใช้งานทราบถึงปัญหาในการอัปโหลด"
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Detail",
                "Type"
            ],
            "rows": [
                [
                    "directory",
                    "ที่อยู่ไฟล์",
                    "String"
                ]
            ]
        }
    ],
    "upload-image-url": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "url",
                    "Public url รูปภาพ",
                    "String",
                    "Required"
                ],
                [
                    "type",
                    "ชนิดของรูปภาพ\nค่าที่เป็นไปได้:\nBOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE",
                    "String",
                    "Required"
                ]
            ]
        },
        {
            "t": "p",
            "text": "สำหรับการอัปโหลดไฟล์เพื่อยืนยันตัวตนในระบบ แบ่งออกเป็น 2 ประเภทหลัก ดังนี้:"
        },
        {
            "t": "h",
            "level": 3,
            "text": "1\\. บุคคลธรรมดา:"
        },
        {
            "t": "p",
            "text": "ผู้ใช้งานที่เป็นบุคคลธรรมดาจะต้องทำการอัปโหลดไฟล์รูปภาพตามรายละเอียดดังต่อไปนี้:"
        },
        {
            "t": "ul",
            "items": [
                "ภาพถ่ายบัตรประชาชน: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพบัตรประชาชนที่ชัดเจน โดยระบุ type ใน request body เป็น ID_CARD",
                "ภาพถ่ายหน้าสมุดบัญชีธนาคาร: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพหน้าสมุดบัญชีธนาคารที่แสดงข้อมูลบัญชีชัดเจน โดยระบุ type ใน request body เป็น BOOKBANK",
                "ภาพถ่ายหน้าตรงคู่กับบัตรประชาชน: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพที่ถ่ายหน้าตรงพร้อมถือบัตรประชาชนแนบกับใบหน้า โดยระบุ type ใน request body เป็น PERSON_ID_CARD"
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "2\\. นิติบุคคล:"
        },
        {
            "t": "p",
            "text": "ผู้ใช้งานที่เป็นนิติบุคคลจะต้องทำการอัปโหลดไฟล์รูปภาพตามรายละเอียดดังต่อไปนี้:"
        },
        {
            "t": "ul",
            "items": [
                "ภาพถ่ายหนังสือรับรองบริษัท: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพหนังสือรับรองบริษัทที่ออกโดยหน่วยงานราชการหรือผู้มีอำนาจ โดยระบุ type ใน request body เป็น CERTIFICATE",
                "ภาพถ่ายหน้าสมุดบัญชีธนาคาร: ผู้ใช้งานต้องอัปโหลดไฟล์รูปภาพหน้าสมุดบัญชีธนาคารที่แสดงข้อมูลบัญชีของบริษัท โดยระบุ type ใน request body เป็น BOOKBANK"
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "รูปแบบไฟล์ที่รองรับ:"
        },
        {
            "t": "p",
            "text": "ระบบรองรับการอัปโหลดไฟล์รูปภาพในรูปแบบต่อไปนี้:"
        },
        {
            "t": "ul",
            "items": [
                "image/jpeg",
                "image/png"
            ]
        },
        {
            "t": "h",
            "level": 3,
            "text": "ข้อกำหนดการอัปโหลด:"
        },
        {
            "t": "ul",
            "items": [
                "ผู้ใช้งานสามารถอัปโหลดได้ครั้งละ 1 ไฟล์ต่อชนิดของรูปภาพในแต่ละคำขอ (Request) เท่านั้น",
                "หลังจากการอัปโหลดไฟล์สำเร็จ ระบบจะคืนค่าที่อยู่ไฟล์ (Directory) เพื่อให้ผู้ใช้งานนำไปใช้ในขั้นตอนการสมัครบัญชี COD ในขั้นตอนถัดไป"
            ]
        },
        {
            "t": "p",
            "text": "หากมีข้อผิดพลาดในการอัปโหลดไฟล์หรือชนิดของไฟล์ไม่ถูกต้อง ระบบจะตอบกลับด้วยข้อความแสดงข้อผิดพลาด (Error Message) เพื่อแจ้งให้ผู้ใช้งานทราบถึงปัญหาในการอัปโหลด"
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Detail",
                "Type"
            ],
            "rows": [
                [
                    "directory",
                    "ที่อยู่ไฟล์",
                    "String"
                ]
            ]
        }
    ],
    "get-image-file": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "directory",
                    "ที่อยู่ไฟล์",
                    "File",
                    "Required"
                ],
                [
                    "type",
                    "ชนิดของรูปภาพ\nค่าที่เป็นไปได้:\nBOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE",
                    "String",
                    "Required"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Detail",
                "Type"
            ],
            "rows": [
                [
                    "",
                    "image file",
                    "File"
                ]
            ]
        }
    ],
    "create-sender-cod": [
        {
            "t": "h",
            "level": 4,
            "text": "Request Body"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "bankAccount",
                    "ข้อมูลบัญชีธนาคาร",
                    "Object",
                    "Required"
                ],
                [
                    "bankAccount.bankInitial",
                    "อักษรย่อธนาคาร",
                    "String",
                    "Required\nค่าที่เป็นไปได้\nKBANK, SCB, BBL, KTB, TMB, BAY"
                ],
                [
                    "bankAccount.holderName",
                    "ชื่อบนสมุดบัญชีธนาคาร",
                    "String",
                    "Required"
                ],
                [
                    "bankAccount.number",
                    "หมายเลขสมุดบัญชีธนาคาร",
                    "String",
                    "Required"
                ],
                [
                    "bankAccount.bookBankImage",
                    "ภาพถ่ายหน้าสมุดบัญชีธนาคาร",
                    "String",
                    "Required\n(ข้อมูลที่ได้จากการอัพโหลดกับระบบ)"
                ],
                [
                    "identification",
                    "ข้อมูลการยืนยันตัวตน",
                    "Object",
                    "Required"
                ],
                [
                    "identification.number",
                    "หมายเลขประจำตัวประชาชน / หมายเลขนิติบุคคล",
                    "String",
                    "Required"
                ],
                [
                    "identification.image",
                    "ภาพถ่ายบัตรประชาชน / ภาพถ่ายหนังสือรับรองบริษัท",
                    "String",
                    "Required\n(ข้อมูลที่ได้จากการอัพโหลดกับระบบ)"
                ],
                [
                    "identification.selfPicture",
                    "ภาพถ่ายหน้าตรงคู่กับบัตรประชาชน",
                    "String",
                    "Required กรณีที่เป็นประเภทบุคคลธรรมดา\n(ข้อมูลที่ได้จากการอัพโหลดกับระบบ)"
                ],
                [
                    "identification.type",
                    "ประเภทบัญชี COD",
                    "String",
                    "Required\nค่าที่เป็นไปได้\nPERSON, LEGAL_ENTITY"
                ],
                [
                    "name",
                    "ชื่อผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "phoneNumber",
                    "เบอร์โทรศัพท์ผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "email",
                    "อีเมลผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "address",
                    "ที่อยู่ผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "subDistrict",
                    "ตำบลผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "district",
                    "อำเภอผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "province",
                    "จังหวัดผู้ส่ง",
                    "String",
                    "Required"
                ],
                [
                    "zipCode",
                    "รหัสไปรษณีย์ผู้ส่ง",
                    "String",
                    "Required"
                ]
            ]
        },
        {
            "t": "p",
            "text": "ฟิลด์ bankAccount.bookBankImage: รูปภาพหน้าสมุดบัญชีธนาคาร"
        },
        {
            "t": "p",
            "text": "ฟิลด์ identification.image: รูปภาพสำหรับการยืนยันตัวตนจะแตกต่างกันไปตามประเภทของผู้ใช้งาน:"
        },
        {
            "t": "ul",
            "items": [
                "บุคคลธรรมดา: ต้องอัปโหลดรูปภาพ บัตรประชาชน",
                "นิติบุคคล: ต้องอัปโหลดรูปภาพ หนังสือรับรองบริษัท"
            ]
        },
        {
            "t": "p",
            "text": "ฟิลด์ identification.selfPicture: รูปภาพใช้สำหรับกรณีที่ผู้ใช้งานเป็นบุคคลธรรมดาเท่านั้น"
        },
        {
            "t": "ul",
            "items": [
                "ถ่ายรูปตนเอง หน้าตรง พร้อมถือ บัตรประชาชน แนบกับใบหน้า และให้เห็นบัตรประชานอย่างชัดเจน"
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "การอัปโหลดไฟล์รูปภาพสำหรับฟิลด์ต่าง ๆ"
        },
        {
            "t": "p",
            "text": "สำหรับฟิลด์ bankAccount.bookBankImage, identification.image และ identification.selfPicture"
        },
        {
            "t": "p",
            "text": "ผู้ใช้งานจำเป็นต้องอัปโหลดไฟล์รูปภาพที่เกี่ยวข้องจาก Upload Image API"
        },
        {
            "t": "ul",
            "items": [
                "เมื่ออัปโหลดสำเร็จ ระบบจะสร้าง directory path ของไฟล์ที่ถูกจัดเก็บ",
                "ผู้ใช้งานต้องนำ directory path มาใส่ตามฟิลด์ bankAccount.bookBankImage, identification.image และ identification.selfPicture ให้ตรงตามประเภท",
                "directory path จะต้องมาจาก Upload Image API เท่านั้น เพราะจะมีผลกับการตรวจสอบข้อมูลต่อไป"
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "ตารางแสดงชื่ออักษรย่อธนาคารที่ระบบรองรับ"
        },
        {
            "t": "table",
            "headers": [
                "Bank Initial",
                "ธนาคาร"
            ],
            "rows": [
                [
                    "KBANK",
                    "ธนาคารกสิกรไทย"
                ],
                [
                    "SCB",
                    "ธนาคารไทยพาณิชย์"
                ],
                [
                    "BBL",
                    "ธนาคารธนาคารกรุงเทพไทย"
                ],
                [
                    "KTB",
                    "ธนาคารกรุงไทย"
                ],
                [
                    "TMB",
                    "ธนาคารทหารไทยธนชาต"
                ],
                [
                    "BAY",
                    "ธนาคารกรุงศรี"
                ]
            ]
        },
        {
            "t": "h",
            "level": 4,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "message",
                    "ข้อมูลสถานะการสร้างบัญชี COD",
                    "String"
                ],
                [
                    "data",
                    "ข้อมูลตอบกลับหลังจากการสร้างสร้างบัญชี COD",
                    "Object"
                ]
            ]
        },
        {
            "t": "h",
            "level": 5,
            "text": "Data Detail"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "bankAccount",
                    "ข้อมูลผู้ส่ง",
                    "Object"
                ],
                [
                    "bankAccount.bankFullName",
                    "ชื่อเต็มธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.bankInitial",
                    "อักษรย่อธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.holderName",
                    "ชื่อบนสมุดบัญชีธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.number",
                    "หมายเลขสมุดบัญชีธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.bookBankImage",
                    "ภาพถ่ายหน้าสมุดบัญชีธนาคาร",
                    "String"
                ],
                [
                    "approval",
                    "สถานะการอนุมัติ",
                    "String"
                ],
                [
                    "updateApprovalDate",
                    "เวลาการอนุมัติ",
                    "String"
                ],
                [
                    "name",
                    "ชื่อผู้ส่ง",
                    "String"
                ],
                [
                    "phoneNumber",
                    "เบอร์โทรศัพท์ผู้ส่ง",
                    "String"
                ],
                [
                    "email",
                    "อีเมลผู้ส่ง",
                    "String"
                ],
                [
                    "address",
                    "ที่อยู่ผู้ส่ง",
                    "String"
                ],
                [
                    "subDistrict",
                    "ตำบลผู้ส่ง",
                    "String"
                ],
                [
                    "district",
                    "อำเภอผู้ส่ง",
                    "String"
                ],
                [
                    "province",
                    "จังหวัดผู้ส่ง",
                    "String"
                ],
                [
                    "zipCode",
                    "รหัสไปรษณีย์ผู้ส่ง",
                    "String"
                ]
            ]
        }
    ],
    "get-sender-cod": [
        {
            "t": "h",
            "level": 5,
            "text": "Request Query Params"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type",
                "Additional information"
            ],
            "rows": [
                [
                    "email",
                    "Email ของผู้ส่ง COD กำหนดการค้นหา email จำเป็นต้องใส่ email ตาม email pattern\nตัวอย่างเช่น\nValid:\n- test@example.com\nInvalid:\n- test@.com\n- test@domain\n- @domain.com",
                    "String",
                    "Optional Condition\n( จำเป็นต้องใส่การค้นหาด้วย email หรือ phoneNumber หรือ ค้นหาทั้ง email และ phoneNumber )"
                ],
                [
                    "phoneNumber",
                    "เบอร์โทร ของผู้ส่ง COD กำหนดการค้นหา เบอร์โทรต้อง มากกว่า 9 ตัว และไม่เกิน 10 ตัว",
                    "Number",
                    "Optional Condition\n( จำเป็นต้องใส่การค้นหาด้วย email หรือ phoneNumber หรือ ค้นหาทั้ง email และ phoneNumber )"
                ]
            ]
        },
        {
            "t": "h",
            "level": 5,
            "text": "Response"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "data",
                    "ข้อมูลผู้ส่ง COD",
                    "Array"
                ]
            ]
        },
        {
            "t": "h",
            "level": 5,
            "text": "Data detail"
        },
        {
            "t": "table",
            "headers": [
                "Name",
                "Description",
                "Type"
            ],
            "rows": [
                [
                    "bankAccount",
                    "ข้อมูลผู้ส่ง",
                    "Object"
                ],
                [
                    "bankAccount.bankFullName",
                    "ชื่อเต็มธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.bankInitial",
                    "อักษรย่อธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.holderName",
                    "ชื่อบนสมุดบัญชีธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.number",
                    "หมายเลขสมุดบัญชีธนาคาร",
                    "String"
                ],
                [
                    "bankAccount.bookBankImage",
                    "ภาพถ่ายหน้าสมุดบัญชีธนาคาร",
                    "String"
                ],
                [
                    "approval",
                    "สถานะการอนุมัติ\nประกอบด้วย 3 สถานะ\n\"PENDING\" รอการตรวจสอบ,\n\"APPROVED\" ผ่านการตรวจสอบ,\n\"NOT_APPROVED\" ไม่ผ่านการตรวจสอบ,",
                    "String"
                ],
                [
                    "updateApprovalDate",
                    "เวลาการอนุมัติ",
                    "String"
                ],
                [
                    "note",
                    "ข้อมูล เหตุผลการไม่อนุมัติข้อมูล",
                    "String"
                ],
                [
                    "name",
                    "ชื่อผู้ส่ง",
                    "String"
                ],
                [
                    "phoneNumber",
                    "เบอร์โทรศัพท์ผู้ส่ง",
                    "String"
                ],
                [
                    "email",
                    "อีเมลผู้ส่ง",
                    "String"
                ],
                [
                    "address",
                    "ที่อยู่ผู้ส่ง",
                    "String"
                ],
                [
                    "subDistrict",
                    "ตำบลผู้ส่ง",
                    "String"
                ],
                [
                    "district",
                    "อำเภอผู้ส่ง",
                    "String"
                ],
                [
                    "province",
                    "จังหวัดผู้ส่ง",
                    "String"
                ],
                [
                    "zipCode",
                    "รหัสไปรษณีย์ผู้ส่ง",
                    "String"
                ]
            ]
        }
    ]
};

export const OP_RESPONSES: Record<string, ResponseDoc[]> = {
    "generate-access-token": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Tue, 23 Jul 2024 08:29:48 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "Cache-Control",
                    "type": "string",
                    "example": "no-store"
                },
                {
                    "name": "pragma",
                    "type": "string",
                    "example": "no-cache"
                },
                {
                    "name": "x-kong-response-latency",
                    "type": "integer",
                    "example": "18"
                },
                {
                    "name": "CF-Cache-Status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=A4MFFO%2BXaAmLer1jHonrYqSunmCnFGQ2Jd8yclUuBJuStekBMefz%2F3YvxNc9jAUBWlR0VF8C%2BUjacE5vAvrGsWCz8VwyRD54wj7h28rNId69Q7HpnPHzQF8t2RjLlDkULMZ3LtntJMZRHXvf\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8a7a4e070d337b56-BKK"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "expires_in": 7200,
                        "token_type": "bearer",
                        "access_token": "<ACCESS_TOKEN>"
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Tue, 23 Jul 2024 09:23:19 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Content-Length",
                    "type": "integer",
                    "example": "78"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "Cache-Control",
                    "type": "string",
                    "example": "no-store"
                },
                {
                    "name": "pragma",
                    "type": "string",
                    "example": "no-cache"
                },
                {
                    "name": "x-kong-response-latency",
                    "type": "integer",
                    "example": "5"
                },
                {
                    "name": "CF-Cache-Status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=a2L6tZTaYJSF6p4qNX0msddU11jkEeBolW4b4vd96k0sTozuwQZNvFUjroJTBW%2BSPMPhGz4yp4htEroZ9zwlTU5eyLr4vQe%2Ftm6EgpZ8tWuftI6Elo%2FMFDpKiA0yxt7ijsgwJztfjCWFFzZK\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8a7a9c6ba8757b5e-BKK"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "error": "invalid_client",
                        "error_description": "Invalid client authentication"
                    }
                }
            ]
        }
    ],
    "create-parcel-non-cod": [
        {
            "description": "OK",
            "code": "200",
            "headers": [],
            "examples": [
                {
                    "name": "Success 200 NON_COD (ตัวอย่างประกอบ — ไม่มีใน api-1.json)",
                    "media": "application/json",
                    "body": {
                        "message": "create parcel success",
                        "data": {
                            "id": "cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897",
                            "shipping": {
                                "express": "THAI_POST",
                                "trackingNumber": "JB056666571TH",
                                "weightGram": 1000,
                                "statusLog": []
                            },
                            "status": "NEW",
                            "type": "NON_COD",
                            "weightGram": 1000
                        }
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Wed, 09 Oct 2024 16:15:40 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Content-Length",
                    "type": "integer",
                    "example": "152"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"98-GrsGG5xF+Jn0Q3tXyqZu+QkfJVw\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "687"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "19"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=vZC1QG58CdGy%2BvGzr6%2BBePL3cgZ75QBnmRx2vzhoxMwcv2Gemq3miJwao1HjjSqKAqzmGhS%2FvHjic7EagKZkd6RKqxL3LiWFyT8%2B2H39vo0WUwmbZkv%2FLIjWK7HcTiPMRu3MDtQOKA%2FcPP%2FN\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8cffabae1e5287e5-URT"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "Error 400 require weight Gram",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "weightKg not allow. Please use weightGram",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 require weightGram < 10 or >2000",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Gram not allow below 10 gram and more 20,000 gram",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 require Receiver",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "name": "Error",
                        "message": "receiver require"
                    }
                },
                {
                    "name": "Error 400 require Sender",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "name": "Error",
                        "message": "sender require"
                    }
                },
                {
                    "name": "Error 400 insuranceProductPrice invalid",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "insuranceDeclaredValue must be a number between 0 and 50,000",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 require Moo",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "receiver.moo is require",
                        "name": "Error"
                    }
                }
            ]
        },
        {
            "code": "401",
            "description": "Unauthorized",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Wed, 09 Oct 2024 15:30:13 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Content-Length",
                    "type": "integer",
                    "example": "77"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "www-authenticate",
                    "type": "string",
                    "example": "Bearer realm=\"service\""
                },
                {
                    "name": "x-kong-response-latency",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=fo6acQgQNY%2BD8xqC%2BPUWhCRtlXouy%2BmfO9nLzKwxHOSMPevG5l%2BNa1robJxsoc%2F0qp8JV8QCurUq0Awppfl0XSKkGYFEj%2B7m9kU6s5iIH5WX33ut8NOdFKcAiao8whTNXuHkIKI1IK97wbz3\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8cff6920bc70d038-BKK"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "Error 401",
                    "media": "application/json",
                    "body": {
                        "error_description": "The access token is missing",
                        "error": "invalid_request"
                    }
                },
                {
                    "name": "ตัวอย่าง 2",
                    "media": "application/json",
                    "body": {
                        "error": "invalid_request",
                        "error_description": "The access token is missing"
                    }
                }
            ]
        },
        {
            "code": "403",
            "description": "Forbidden",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Error 403",
                    "media": "application/json",
                    "body": {
                        "name": "AccountDisableException",
                        "message": "AccountDisableException"
                    }
                }
            ]
        }
    ],
    "create-parcel-cod": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Thu, 10 Oct 2024 06:22:28 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"4fb-B6GWMy9U7buNowlUP50KuDknk78\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "3097"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "22"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=AgJg1%2Faj9xrI3rMPxY51ldochC9i%2B6rz6f42LNDrhC7pNJSfWKBCYbmYve2oMaD%2BudlE2YEOijsz0300sh3p8laWv5Idxgf6V%2BnYCvcYyJ%2FFo3vzNViTILADNZNWyNZ2tsRoO5rgAiJBwKH8\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8d0484116a06d01f-BKK"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "Success 200 รับประกันพัสดุ",
                    "media": "application/json",
                    "body": {
                        "message": "create parcel success",
                        "data": {
                            "note": "",
                            "receiver": {
                                "address": "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
                                "district": "ศรีราชา",
                                "name": "คุณมายเอ็กซ์เพรส ชลบุรี",
                                "phoneNumber": "0989392917",
                                "province": "ชลบุรี",
                                "subDistrict": "หนองขาม",
                                "zipCode": "20230"
                            },
                            "id": "cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897",
                            "sender": {
                                "address": "99/9",
                                "district": "เมืองจันทบุรี",
                                "name": "Test",
                                "phoneNumber": "0900000000",
                                "province": "จันทบุรี",
                                "subDistrict": "เกาะขวาง",
                                "zipCode": "22000"
                            },
                            "shipping": {
                                "express": "THAI_POST",
                                "trackingNumber": "JA056666571TH",
                                "weightGram": 1000,
                                "statusLog": []
                            },
                            "status": "NEW",
                            "type": "COD",
                            "createdAt": "2024-10-10T06:22:25.897Z",
                            "updatedAt": "2024-10-10T06:22:27.594Z",
                            "weightGram": 1000,
                            "isInsured": true,
                            "insideBoxDetail": [
                                {
                                    "name": "อุปกรณ์อิเล็กทรอนิกส์",
                                    "type": "กล้่อง Cannon",
                                    "size": "ขนาดเล็ก (S)",
                                    "color": "สีดำ (Black)",
                                    "amount": 1,
                                    "price": 1,
                                    "weightGram": 1000
                                }
                            ],
                            "codAmount": 100,
                            "codEnabled": true,
                            "codFee": 1.3,
                            "codFeeVat": 0.09,
                            "insuranceDeclaredValue": 3500,
                            "insuranceProductPrice": 3000
                        }
                    }
                },
                {
                    "name": "Success 200 ไม่รับประกันพัสดุ",
                    "media": "application/json",
                    "body": {
                        "message": "create parcel success",
                        "data": {
                            "note": "",
                            "receiver": {
                                "address": "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
                                "district": "ศรีราชา",
                                "name": "คุณมายเอ็กซ์เพรส ชลบุรี",
                                "phoneNumber": "0989392917",
                                "province": "ชลบุรี",
                                "subDistrict": "หนองขาม",
                                "zipCode": "20230"
                            },
                            "id": "cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897",
                            "sender": {
                                "address": "99/9",
                                "district": "เมืองจันทบุรี",
                                "name": "Test",
                                "phoneNumber": "0900000000",
                                "province": "จันทบุรี",
                                "subDistrict": "เกาะขวาง",
                                "zipCode": "22000"
                            },
                            "shipping": {
                                "express": "THAI_POST",
                                "trackingNumber": "JA056666571TH",
                                "weightGram": 1000,
                                "statusLog": []
                            },
                            "status": "NEW",
                            "type": "COD",
                            "createdAt": "2024-10-10T06:22:25.897Z",
                            "updatedAt": "2024-10-10T06:22:27.594Z",
                            "weightGram": 1000,
                            "isInsured": false,
                            "insideBoxDetail": [
                                {
                                    "name": "อุปกรณ์อิเล็กทรอนิกส์",
                                    "type": "กล้่อง Cannon",
                                    "size": "ขนาดเล็ก (S)",
                                    "color": "สีดำ (Black)",
                                    "amount": 1,
                                    "price": 1,
                                    "weightGram": 1000
                                }
                            ],
                            "codAmount": 100,
                            "codEnabled": true,
                            "codFee": 1.3,
                            "codFeeVat": 0.09
                        }
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Wed, 09 Oct 2024 16:15:40 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Content-Length",
                    "type": "integer",
                    "example": "152"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"98-GrsGG5xF+Jn0Q3tXyqZu+QkfJVw\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "687"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "19"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=vZC1QG58CdGy%2BvGzr6%2BBePL3cgZ75QBnmRx2vzhoxMwcv2Gemq3miJwao1HjjSqKAqzmGhS%2FvHjic7EagKZkd6RKqxL3LiWFyT8%2B2H39vo0WUwmbZkv%2FLIjWK7HcTiPMRu3MDtQOKA%2FcPP%2FN\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8cffabae1e5287e5-URT"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "Error 400 account COD waiting approve",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "senderCOD phoneNumber 0810000000 is currently pending approval or has not been approved",
                        "name": "SenderCODNotApproveException"
                    }
                },
                {
                    "name": "Error 400 account COD not approve",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "senderCOD phoneNumber 0810000000 is currently pending approval or has not been approved",
                        "name": "SenderCODNotApproveException"
                    }
                },
                {
                    "name": "Error 400 require weight Gram",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "weightKg not allow. Please use weightGram",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 require weightGram < 10 or >2000",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Gram not allow below 10 gram and more 20,000 gram",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 require codAmount and > 0",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "not found codAmount or codAmount less than 1",
                        "name": "CODAmountInvalidException"
                    }
                },
                {
                    "name": "Error 400 codAmount have more than 2 decimal places",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "not found codAmount or codAmount less than 1 or codAmount must not have more than 2 decimal places",
                        "name": "CODAmountInvalidException"
                    }
                },
                {
                    "name": "Error 400 require insideBoxDetail",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "cannot create parcel cod because not found insideBoxDetail or length equal 0",
                        "name": "InsideBoxDetailNotCorrectException"
                    }
                },
                {
                    "name": "Error 400 phone number invalid",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "not found sender.phoneNumber or invalid length",
                        "name": "SenderPhoneNumberInvalidException"
                    }
                },
                {
                    "name": "Error 400 email invalid",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "not found sender.email or invalid format",
                        "name": "SenderEmailInvalidException"
                    }
                },
                {
                    "name": "Error 400 insuranceDeclaredValue invalid",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "not found sender.email or invalid format",
                        "name": "SenderEmailInvalidException"
                    }
                },
                {
                    "name": "Error 400 require Receiver",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "name": "Error",
                        "message": "receiver require"
                    }
                },
                {
                    "name": "Error 400 require Sender",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "name": "Error",
                        "message": "sender require"
                    }
                },
                {
                    "name": "Error 400 insuranceProductPrice invalid",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "insuranceDeclaredValue must be a number between 0 and 50,000",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 require Moo",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "receiver.moo is require",
                        "name": "Error"
                    }
                }
            ]
        },
        {
            "code": "401",
            "description": "Unauthorized",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Wed, 09 Oct 2024 15:30:13 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Content-Length",
                    "type": "integer",
                    "example": "77"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "www-authenticate",
                    "type": "string",
                    "example": "Bearer realm=\"service\""
                },
                {
                    "name": "x-kong-response-latency",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=fo6acQgQNY%2BD8xqC%2BPUWhCRtlXouy%2BmfO9nLzKwxHOSMPevG5l%2BNa1robJxsoc%2F0qp8JV8QCurUq0Awppfl0XSKkGYFEj%2B7m9kU6s5iIH5WX33ut8NOdFKcAiao8whTNXuHkIKI1IK97wbz3\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8cff6920bc70d038-BKK"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "Error 401",
                    "media": "application/json",
                    "body": {
                        "error_description": "The access token is missing",
                        "error": "invalid_request"
                    }
                },
                {
                    "name": "ตัวอย่าง 2",
                    "media": "application/json",
                    "body": {
                        "error": "invalid_request",
                        "error_description": "The access token is missing"
                    }
                }
            ]
        },
        {
            "code": "403",
            "description": "Forbidden",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Error 403",
                    "media": "application/json",
                    "body": {
                        "name": "AccountDisableException",
                        "message": "AccountDisableException"
                    }
                }
            ]
        },
        {
            "code": "404",
            "description": "Not Found",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Wed, 09 Oct 2024 15:34:28 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"6e-92K+71nMcqoSz30IJRSXyxwLrwo\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "22"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=IuXIBLSGbkxbet4pQ3VH5kK3ToWzVHU3ASi2HumrtUFoCs7glkyR1Efjl%2FCJevrM%2BLen0tIPZFnziWO8Rf8xYe4QwZrii6dLoTiBpIxPTNb7lMGSNML0RMp5o6perq7ZUOx3J9eGZ26x%2BX34\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8cff6f5b8fe3a8cf-SIN"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                }
            ],
            "examples": [
                {
                    "name": "Error 404 not found accountCOD",
                    "media": "application/json",
                    "body": {
                        "status": 404,
                        "message": "not found senderCOD with phoneNumber 0820000000",
                        "name": "SenderCODNotFoundException"
                    }
                }
            ]
        }
    ],
    "get-parcel": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "notFoundTrackingNumbers": [
                            "JB012345678TH"
                        ],
                        "express": "THAI_POST",
                        "data": [
                            {
                                "note": "",
                                "receiver": {
                                    "address": "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
                                    "district": "ศรีราชา",
                                    "name": "คุณมายเอ็กซ์เพรส ชลบุรี",
                                    "phoneNumber": "0989392917",
                                    "province": "ชลบุรี",
                                    "subDistrict": "หนองขาม",
                                    "zipCode": "20230"
                                },
                                "id": "1211c0bccc0142404df1274999e94d0144c3eadc181bb95ee01cfb61ea46e7e1OP1723622204784",
                                "sender": {
                                    "address": "69/429 หมู่ 2",
                                    "district": "เมืองภูเก็ต",
                                    "name": "คุณมายเอ็กซ์เพรส ภูเก็ต",
                                    "phoneNumber": "0813150764",
                                    "province": "ภูเก็ต",
                                    "subDistrict": "วิชิต",
                                    "zipCode": "83000"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "JB052917036TH",
                                    "weightGram": 1000
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T07:56:44.783Z",
                                "updatedAt": "2024-08-14T07:56:44.957Z",
                                "weightGram": 10000
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
                                    "district": "ศรีราชา",
                                    "name": "คุณมายออเดอร์ ชลบุรี",
                                    "phoneNumber": "0856779101",
                                    "province": "ชลบุรี",
                                    "subDistrict": "หนองขาม",
                                    "zipCode": "20230"
                                },
                                "id": "c293ecfdc710dce4540056cf51ea6cd1a56aff3eba142526fdb19a55c5fc2f00OP1722422798569",
                                "sender": {
                                    "address": "69/429 หมู่ 2",
                                    "district": "เมืองภูเก็ต",
                                    "name": "คุณมายออเดอร์ ภูเก็ต",
                                    "phoneNumber": "0815690987",
                                    "province": "ภูเก็ต",
                                    "subDistrict": "วิชิต",
                                    "zipCode": "83000"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "JB050236582TH",
                                    "weightGram": 1000
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-07-31T10:46:38.569Z",
                                "updatedAt": "2024-07-31T10:46:38.983Z",
                                "weightGram": 1000
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
                                    "district": "เกาะสีชัง",
                                    "name": "คุณมายออเดอร์ ชลบุรี",
                                    "phoneNumber": "0811729602",
                                    "province": "ชลบุรี",
                                    "subDistrict": "ท่าเทววงษ์",
                                    "zipCode": "20120"
                                },
                                "id": "3d978cfbf3fcf6bcd147ac2f1539d66defd539612009bea0c0f9279c7e4cdbe3OP1723618385929",
                                "sender": {
                                    "address": "69/429 หมู่ 2",
                                    "district": "เมืองภูเก็ต",
                                    "name": "คุณมายออเดอร์ ภูเก็ต",
                                    "phoneNumber": "0838083207",
                                    "province": "ภูเก็ต",
                                    "subDistrict": "วิชิต",
                                    "zipCode": "83000"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "JB052917037TH",
                                    "weightGram": 360
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T06:53:05.928Z",
                                "updatedAt": "2024-08-14T06:53:06.485Z",
                                "weightGram": 360
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "581/91 หมู่บ้านพฤกษาวิลล์107/5 สุขสวัสดิ์ 78",
                                    "district": "พระสมุทรเจดีย์",
                                    "name": "คุณมายออเดอร์ สมุทรปราการ",
                                    "phoneNumber": "0824922944",
                                    "province": "สมุทรปราการ",
                                    "subDistrict": "ในคลองบางปลากด",
                                    "zipCode": "10290"
                                },
                                "id": "45a6d1356cb85d1542268cd333f6404e55010fcfe01e3cf7df441673f2a8c94eOP1723616118012",
                                "sender": {
                                    "address": "PP Residence ห้อง 201",
                                    "district": "ยานนาวา",
                                    "name": "คุณมายออเดอร์ กรุงเทพมหานคร",
                                    "phoneNumber": "0869375604",
                                    "province": "กรุงเทพมหานคร",
                                    "subDistrict": "บางโพงพาง",
                                    "zipCode": "10120"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "TEST1111",
                                    "weightGram": 10
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T06:15:18.012Z",
                                "updatedAt": "2024-08-14T06:15:18.160Z",
                                "weightGram": 10
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "581/91 หมู่บ้านพฤกษาวิลล์107/5 สุขสวัสดิ์ 78",
                                    "district": "พระสมุทรเจดีย์",
                                    "name": "คุณมายออเดอร์ กรุงเทพมหานคร",
                                    "phoneNumber": "0824922944",
                                    "province": "สมุทรปราการ",
                                    "subDistrict": "ในคลองบางปลากด",
                                    "zipCode": "10290"
                                },
                                "id": "1d918829b9ce8f52e7fe6a91cca8a9e7acebaa2d099ad1348c343d584ca72cadOP1723615779195",
                                "sender": {
                                    "address": "PP Residence ห้อง 201",
                                    "district": "ยานนาวา",
                                    "name": "คุณมายออเดอร์ กรุงเทพมหานคร",
                                    "phoneNumber": "0869375604",
                                    "province": "กรุงเทพมหานคร",
                                    "subDistrict": "บางโพงพาง",
                                    "zipCode": "10120"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "TEST1112",
                                    "weightGram": 10
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T06:09:39.194Z",
                                "updatedAt": "2024-08-14T06:09:39.344Z",
                                "weightGram": 10
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "581/91 หมู่บ้านพฤกษาวิลล์107/5 สุขสวัสดิ์ 78",
                                    "district": "พระสมุทรเจดีย์",
                                    "name": "คุณมายออเดอร์ สมุทรปราการ",
                                    "phoneNumber": "0824922944",
                                    "province": "สมุทรปราการ",
                                    "subDistrict": "ในคลองบางปลากด",
                                    "zipCode": "10290"
                                },
                                "id": "2e436a180f005b083317e6ccdb89c8c3e22d7db82b084fd4cb3c4500e2cc12d3OP1723610342386",
                                "sender": {
                                    "address": "PP Residence ห้อง 201",
                                    "district": "ยานนาวา",
                                    "name": "คุณมายออเดอร์ กรุงเทพมหานคร",
                                    "phoneNumber": "0869375604",
                                    "province": "กรุงเทพมหานคร",
                                    "subDistrict": "บางโพงพาง",
                                    "zipCode": "10120"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "TEST1113",
                                    "weightGram": 1000
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T04:39:02.386Z",
                                "updatedAt": "2024-08-14T04:39:02.555Z",
                                "weightGram": 1000
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "581/91 หมู่บ้านพฤกษาวิลล์107/5 สุขสวัสดิ์ 78",
                                    "district": "พระสมุทรเจดีย์",
                                    "name": "คุณมายออเดอร์ สมุทรปราการ",
                                    "phoneNumber": "0824922944",
                                    "province": "สมุทรปราการ",
                                    "subDistrict": "ในคลองบางปลากด",
                                    "zipCode": "10290"
                                },
                                "id": "7bdddce1435ff5332937ec82bc528897b54dd0f63b6edb82f78e2c1ff530f06bOP1723609934928",
                                "sender": {
                                    "address": "PP Residence ห้อง 201",
                                    "district": "ยานนาวา",
                                    "name": "คุณมายออเดอร์ กรุงเทพมหานคร",
                                    "phoneNumber": "0869375604",
                                    "province": "กรุงเทพมหานคร",
                                    "subDistrict": "บางโพงพาง",
                                    "zipCode": "10120"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "TEST1114",
                                    "weightGram": 1000
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T04:32:14.928Z",
                                "updatedAt": "2024-08-14T04:32:15.083Z",
                                "weightGram": 1000
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "581/91 หมู่บ้านพฤกษาวิลล์107/5 สุขสวัสดิ์ 78",
                                    "district": "พระสมุทรเจดีย์",
                                    "name": "คุณมายออเดอร์ สมุทรปราการ",
                                    "phoneNumber": "0824922944",
                                    "province": "สมุทรปราการ",
                                    "subDistrict": "ในคลองบางปลากด",
                                    "zipCode": "10290"
                                },
                                "id": "090cab1d51ea3bcbfa3b9b4cc6fb597f236d15ddd4cf3953f30e3d28d596b911OP1723609742419",
                                "sender": {
                                    "address": "PP Residence ห้อง 201",
                                    "district": "ยานนาวา",
                                    "name": "คุณมายออเดอร์ กรุงเทพมหานคร",
                                    "phoneNumber": "0869375604",
                                    "province": "กรุงเทพมหานคร",
                                    "subDistrict": "บางโพงพาง",
                                    "zipCode": "10120"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "TEST1115",
                                    "weightGram": 1000
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T04:29:02.418Z",
                                "updatedAt": "2024-08-14T04:29:02.577Z",
                                "weightGram": 1000
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "581/91 หมู่บ้านพฤกษาวิลล์107/5 สุขสวัสดิ์ 78",
                                    "district": "พระสมุทรเจดีย์",
                                    "name": "คุณมายออเดอร์ สมุทรปราการ",
                                    "phoneNumber": "0824922944",
                                    "province": "สมุทรปราการ",
                                    "subDistrict": "ในคลองบางปลากด",
                                    "zipCode": "10290"
                                },
                                "id": "2bb4e3a6415fa87205c53b0cd1002292cd806a6621a9f2810aaa7929e688debcOP1723608889296",
                                "sender": {
                                    "address": "PP Residence ห้อง 201",
                                    "district": "ยานนาวา",
                                    "name": "คุณมายออเดอร์ กรุงเทพมหานคร",
                                    "phoneNumber": "0869375604",
                                    "province": "กรุงเทพมหานคร",
                                    "subDistrict": "บางโพงพาง",
                                    "zipCode": "10120"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [],
                                    "trackingNumber": "TEST1116",
                                    "weightGram": 1000
                                },
                                "status": "NEW",
                                "type": "NON_COD",
                                "createdAt": "2024-08-14T04:14:49.296Z",
                                "updatedAt": "2024-08-14T04:14:49.470Z",
                                "weightGram": 1000
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
                                    "district": "ศรีราชา",
                                    "name": "คุณมายออเดอร์ ชลบุรี",
                                    "phoneNumber": "0872570359",
                                    "province": "ชลบุรี",
                                    "subDistrict": "หนองขาม",
                                    "zipCode": "20230"
                                },
                                "id": "dbd61e125fcbca1f297139feeed8e60812a33b5973426e3c54edbd27dfd0fd61OP1722422793562",
                                "sender": {
                                    "address": "69/429 หมู่ 2",
                                    "district": "เมืองภูเก็ต",
                                    "name": "คุณมายออเดอร์ ภูเก็ต",
                                    "phoneNumber": "0887656466",
                                    "province": "ภูเก็ต",
                                    "subDistrict": "วิชิต",
                                    "zipCode": "83000"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236579TH"
                                        }
                                    ],
                                    "trackingNumber": "JB050236579TH",
                                    "weightGram": 1000
                                },
                                "status": "PICKUPED",
                                "type": "NON_COD",
                                "createdAt": "2024-07-31T10:46:33.562Z",
                                "updatedAt": "2024-08-15T06:37:18.433Z",
                                "weightGram": 1000
                            },
                            {
                                "note": "",
                                "receiver": {
                                    "address": "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
                                    "district": "ศรีราชา",
                                    "name": "คุณมายออเดอร์ ชลบุรี",
                                    "phoneNumber": "0872129126",
                                    "province": "ชลบุรี",
                                    "subDistrict": "หนองขาม",
                                    "zipCode": "20230"
                                },
                                "id": "d16b201b1abd2f8963889f5d5ec9f6045e93d73e29abd841f203b1d9c3ce5b12OP1722422802867",
                                "sender": {
                                    "address": "69/429 หมู่ 2",
                                    "district": "เมืองภูเก็ต",
                                    "name": "คุณมายออเดอร์ ภูเก็ต",
                                    "phoneNumber": "0888580766",
                                    "province": "ภูเก็ต",
                                    "subDistrict": "วิชิต",
                                    "zipCode": "83000"
                                },
                                "shipping": {
                                    "express": "THAI_POST",
                                    "statusLog": [
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T03:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        },
                                        {
                                            "code": "1",
                                            "timestamp": "2024-08-07T10:00:19.000Z",
                                            "message": "รับฝาก",
                                            "isReturn": false,
                                            "weightGram": 1000,
                                            "trackingNumber": "JB050236596TH"
                                        }
                                    ],
                                    "trackingNumber": "JB050236596TH",
                                    "weightGram": 1000
                                },
                                "status": "PICKUPED",
                                "type": "NON_COD",
                                "createdAt": "2024-07-31T10:46:42.867Z",
                                "updatedAt": "2024-08-09T09:05:57.039Z",
                                "weightGram": 1000
                            }
                        ]
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Error 400 require express THAI_POST",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Express name: undefined is not allow. Please change to express that you can accept.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 tracking number limit",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Tracking numbers must be require. Tracking numbers must have a limit of 20.",
                        "name": "BadRequestException"
                    }
                }
            ]
        }
    ],
    "delete-parcel": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Wed, 24 Jul 2024 07:09:31 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"79-XrDQYPRqMJsRRPbGOYuIqfcINEI\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "873"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "22"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "CF-Cache-Status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=mZHilLrhL0A5Z%2BsVMLJRxyxpk%2F2x7Vx4nyW53N8es%2FlIivhXt%2FJN7xDp7FaDFt2%2FXp10CDBMqYM5f3UPK%2FlhBWQDIJryZmljq%2BiGPzuB3PKXa3E55le0T7Z7b5pn0z0pgnBZ662E14XrI3b%2B\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8a8215ca5e3818fc-SIN"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "message": "delete parcelNumber: 8a88a0acb0ff10fb526cb3de97f7c1681e8cc488d4b39eb646f484fbf23cb8e3OP1721804390165 success"
                    }
                }
            ]
        },
        {
            "code": "404",
            "description": "Not Found",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Wed, 24 Jul 2024 07:10:12 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"61-5QEeshd8Q5gQBx2UsnVPPaEUKPo\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "21"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "29"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "CF-Cache-Status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=TIUWZEb8b1B7Kn1WS%2BAcEwNbvIWqRzM2zpG3nmsSIeEfmf6%2B9zuYY8dM0iOXQd7B2Wvl%2B%2F03VqXRfgjXf8w34m0HHpBGcDJXnmc7lANxOJFHmzNZbAyvkmr%2B2Of%2BYaLFzrIaE1dPk7HGTWN1\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8a8216cced9018fc-SIN"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "status": 404,
                        "message": "Parcel with refId=[1721804390165] not found",
                        "name": "NotFoundException"
                    }
                }
            ]
        }
    ],
    "check-payment-status": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Tue, 19 Nov 2024 09:58:39 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"ce-08RjtPg6X1lZ6yulh/v+AS3q5ys\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "22"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "27"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "CF-Cache-Status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=r7NpAr9J3QbGhtMvF2cml5fpL4IS4phxu9o0C4epqcI08O6CtfCXYG6KgFwxQCHPzT5PdsH2YJQ5YJfEvMwbUrG%2B4biBEOTkGDwafwPbzZ4EEjojjuLvbyTvz2M1PohQ7OQW1TUnYeSYB1o2\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8e4f57d09b1c7b50-BKK"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                },
                {
                    "name": "server-timing",
                    "type": "string",
                    "example": "cfL4;desc=\"?proto=TCP&rtt=30016&sent=5&recv=7&lost=0&retrans=0&sent_bytes=2813&recv_bytes=981&delivery_rate=121922&cwnd=252&unsent_bytes=0&cid=0960dcdc383f1895&ts=189&x=0\""
                }
            ],
            "examples": [
                {
                    "name": "Success: status REJECTED",
                    "media": "application/json",
                    "body": {
                        "trackingNumber": "JA056666917TH",
                        "codTransferStatus": "REJECTED",
                        "codTransferDate": "",
                        "shippingCost": {
                            "totalAmount": 18.391,
                            "shippingCost": 17,
                            "codAmount": 100,
                            "codFee": 1.3,
                            "codVat": 0.091,
                            "specialAreaCost": 0
                        }
                    }
                },
                {
                    "name": "Success: status TRANSFERRED",
                    "media": "application/json",
                    "body": {
                        "trackingNumber": "JA056666695TH",
                        "codTransferStatus": "TRANSFERRED",
                        "codTransferDate": "2024-10-21",
                        "shippingCost": {
                            "totalAmount": 18.391,
                            "shippingCost": 17,
                            "codAmount": 100,
                            "codFee": 1.3,
                            "codVat": 0.091,
                            "specialAreaCost": 0
                        }
                    }
                },
                {
                    "name": "Success: status PENDING",
                    "media": "application/json",
                    "body": {
                        "trackingNumber": "JA056666687TH",
                        "codTransferStatus": "PENDING",
                        "codTransferDate": "",
                        "shippingCost": {
                            "totalAmount": 18.391,
                            "shippingCost": 17,
                            "codAmount": 100,
                            "codFee": 1.3,
                            "codVat": 0.091,
                            "specialAreaCost": 0
                        }
                    }
                },
                {
                    "name": "Success: status NONE",
                    "media": "application/json",
                    "body": {
                        "trackingNumber": "JA056666545TH",
                        "codTransferStatus": "NONE",
                        "codTransferDate": "",
                        "shippingCost": {
                            "totalAmount": 17.0139,
                            "shippingCost": 17,
                            "codAmount": 1,
                            "codFee": 0.013,
                            "codVat": 0.0009,
                            "specialAreaCost": 0
                        }
                    }
                }
            ]
        },
        {
            "code": "404",
            "description": "Not Found",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Mon, 21 Oct 2024 03:18:16 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"5e-FashAC85JWYu4r+X+doUlmxhqN0\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "82"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "30"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=qaHfKzE72j4VHKLe8FyXeLFXL7O1GxURhZkgjO5%2FJDbnEAt6oGHb94FXaSMHzxKPHnluqBV4saLdBqFgQ%2FF7PoaE2eZRq%2Bch5s4tJGirnDZsYxRrQ6jfA78CPc5yUN4p8WGoWMPqZnqjTSbe\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8d5e1972fdbdee5e-BKK"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                },
                {
                    "name": "server-timing",
                    "type": "string",
                    "example": "cfL4;desc=\"?proto=TCP&rtt=72019&sent=67&recv=66&lost=0&retrans=1&sent_bytes=5881&recv_bytes=1781&delivery_rate=126281&cwnd=255&unsent_bytes=0&cid=4ae4b768d624a9f5&ts=55977&x=0\""
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "status": 404,
                        "message": "trackingNumber=[JA000000000TH] not found",
                        "name": "NotFoundException"
                    }
                }
            ]
        }
    ],
    "simulate-thaipost-webhook": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Tue, 17 Sep 2024 09:33:44 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"3b-ejMK86QMkqqPDZFVVCItNQSoyls\""
                },
                {
                    "name": "function-execution-id",
                    "type": "string",
                    "example": "o6bu8o61j8t7"
                },
                {
                    "name": "x-cloud-trace-context",
                    "type": "string",
                    "example": "c912d65e2e364273945d50545e373f86;o=1"
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "794"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "32"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "CF-Cache-Status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=VC8%2BtXkD8of8wI6otA7lp1K9NtYNygz4Ao5usvARKUK6T18u%2FfoUnYt3GAhW%2BGMlCpMfWsmP5ipEyeu78ljnmnRmusysSR94Oxl1iJEkjI164yM%2FS3RzuSRfM8GbbYM4o5oPl8U9rQNXtHIe\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8c4818a8c9787b48-BKK"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "errorCode": "000",
                        "errorDetail": "success",
                        "status": "true"
                    }
                }
            ]
        }
    ],
    "print-label": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "text/html"
                },
                {
                    "name": "content-disposition",
                    "type": "string",
                    "example": "attachment;filename=1723543704932.pdf"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "text/plain",
                    "body": "Response เป็นไฟล์ PDF แบบ blob (Content-Type: application/pdf, Content-Disposition: attachment;filename={timestamp}.pdf)"
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "The number of parcel IDs must be greater than 0 and not exceed the limit of 20. Please adjust the number of parcel IDs and try again.",
                        "name": "BadRequestException"
                    }
                }
            ]
        },
        {
            "code": "404",
            "description": "Not Found",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "status": 404,
                        "message": "No parcels found for the given reference IDs with this account.",
                        "name": "NotFoundException"
                    }
                }
            ]
        },
        {
            "code": "default",
            "description": "default",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "The number of parcel IDs must be greater than 0 and not exceed the limit of 20. Please adjust the number of parcel IDs and try again.",
                        "name": "BadRequestException"
                    }
                }
            ]
        }
    ],
    "upload-image-file": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Success (หน้าสมุดบัญชีธนาคาร)",
                    "media": "application/json",
                    "body": {
                        "directory": "mxp-bookbank-cod-image/mxp-bookbank-cod-image/xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png"
                    }
                },
                {
                    "name": "Success (บัตรประชาชน)",
                    "media": "application/json",
                    "body": {
                        "directory": "mxp-identification-cod-image/mxp-identification-cod-image/idCard_xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png"
                    }
                },
                {
                    "name": "Success (รูปคู่บัตรประชาชน)",
                    "media": "application/json",
                    "body": {
                        "directory": "mxp-identification-cod-image/mxp-identification-cod-image/PersonIdCard_xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png"
                    }
                },
                {
                    "name": "Success (หนังสือรับรองบริษัท)",
                    "media": "application/json",
                    "body": {
                        "directory": "mxp-identification-cod-image/mxp-identification-cod-image/Cert_xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png"
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Error 400 No File Attach",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "File is required.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 Required Type",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Type is required.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 Invalid Type",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Invalid type.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 Multiple Files",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "You can upload only one file.",
                        "name": "BadRequestException"
                    }
                }
            ]
        }
    ],
    "upload-image-url": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Sat, 12 Oct 2024 20:07:40 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Transfer-Encoding",
                    "type": "string",
                    "example": "chunked"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"80-mQw/RTBre9BMYaAhbMoKV18+kZ4\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "653"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "2"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=IqXtdRKJxlXAJZOvM5cC4QkvZixRIIcMSsN7b5kO0Zi2OD6r6fef6UobUVcZwo8mvvnrVzHibqmfEw20%2Fv7ymS7EIHR%2B3Ow0UStgFG2e5MoLk3mycCaFDihnihbFPIBzjbJqf8eA4wOmxLNm\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8d19b7a96f1f7b44-BKK"
                },
                {
                    "name": "Content-Encoding",
                    "type": "string",
                    "example": "br"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "directory": "beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg"
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Date",
                    "type": "string",
                    "example": "Sat, 12 Oct 2024 20:08:45 GMT"
                },
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json; charset=utf-8"
                },
                {
                    "name": "Content-Length",
                    "type": "integer",
                    "example": "72"
                },
                {
                    "name": "Connection",
                    "type": "string",
                    "example": "keep-alive"
                },
                {
                    "name": "ratelimit-reset",
                    "type": "integer",
                    "example": "1"
                },
                {
                    "name": "x-ratelimit-remaining-second",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-ratelimit-limit-second",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-limit",
                    "type": "integer",
                    "example": "25"
                },
                {
                    "name": "ratelimit-remaining",
                    "type": "integer",
                    "example": "24"
                },
                {
                    "name": "x-powered-by",
                    "type": "string",
                    "example": "Express"
                },
                {
                    "name": "access-control-allow-origin",
                    "type": "string",
                    "example": "*"
                },
                {
                    "name": "etag",
                    "type": "string",
                    "example": "W/\"48-IbCUpLVdUkgvmlCKwqrEg4sjZ2s\""
                },
                {
                    "name": "x-kong-upstream-latency",
                    "type": "integer",
                    "example": "14"
                },
                {
                    "name": "x-kong-proxy-latency",
                    "type": "integer",
                    "example": "16"
                },
                {
                    "name": "via",
                    "type": "string",
                    "example": "kong/3.4.2"
                },
                {
                    "name": "cf-cache-status",
                    "type": "string",
                    "example": "DYNAMIC"
                },
                {
                    "name": "Report-To",
                    "type": "string",
                    "example": "{\"endpoints\":[{\"url\":\"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=7faMQFlJ6GKXhEI%2BVePWSI2nS6gUJOfsrxaiDfnAGMoDKCJ%2BXkLGQlvEb2BkJQSvISgzeviR%2BPdN9fcio28WfbHGaURBBRiyG%2B%2BNwoimLYCOVs6kvwShKpdHPtHivipYlFZuSlX1imi8ZipT\"}],\"group\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "NEL",
                    "type": "string",
                    "example": "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}"
                },
                {
                    "name": "Server",
                    "type": "string",
                    "example": "cloudflare"
                },
                {
                    "name": "CF-RAY",
                    "type": "string",
                    "example": "8d19b9452eda7b44-BKK"
                },
                {
                    "name": "alt-svc",
                    "type": "string",
                    "example": "h3=\":443\"; ma=86400"
                }
            ],
            "examples": [
                {
                    "name": "Error 400 Require Url",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Url is required.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 Require Type",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Type is required.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 Failed to download",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Failed to download file from URL: Request failed with status code 403",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 Invalid Type",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Invalid type.",
                        "name": "BadRequestException"
                    }
                }
            ]
        }
    ],
    "get-image-file": [
        {
            "code": "200",
            "description": "Successful response",
            "headers": [],
            "examples": [
                {
                    "name": "",
                    "media": "",
                    "body": "Response เป็นไฟล์รูปภาพ (image file)"
                }
            ]
        }
    ],
    "create-sender-cod": [
        {
            "code": "200",
            "description": "OK",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Success (บุคคลธรรมดา)",
                    "media": "application/json",
                    "body": {
                        "message": "create sender cod success",
                        "data": {
                            "bankAccount": {
                                "bankFullName": "ธนาคารกสิกรไทย (KBANK)",
                                "bankInitial": "KBANK",
                                "holderName": "Test",
                                "number": "00000000000",
                                "bookBankImage": "mxp-bookbank-cod-image/mxp-bookbank-cod-image/Cert-1707213724144.png"
                            },
                            "approval": "PENDING",
                            "updateApprovalDate": "2024-10-09 06:07:06",
                            "name": "Test",
                            "phoneNumber": "0900000004",
                            "email": "test@test.com",
                            "address": "99/9",
                            "subDistrict": "เกาะขวาง",
                            "district": "เมืองจันทบุรี",
                            "province": "จันทบุรี",
                            "zipCode": "22000"
                        }
                    }
                },
                {
                    "name": "Success (นิติบุคคล)",
                    "media": "application/json",
                    "body": {
                        "message": "create sender cod success",
                        "data": {
                            "bankAccount": {
                                "bankFullName": "ธนาคารกสิกรไทย (KBANK)",
                                "bankInitial": "KBANK",
                                "holderName": "Test",
                                "number": "00000000000",
                                "bookBankImage": "mxp-bookbank-cod-image/mxp-bookbank-cod-image/1707213724144.png"
                            },
                            "approval": "PENDING",
                            "updateApprovalDate": "2024-10-09 06:07:06",
                            "name": "Test",
                            "phoneNumber": "0900000004",
                            "email": "test@test.com",
                            "address": "99/9",
                            "subDistrict": "เกาะขวาง",
                            "district": "เมืองจันทบุรี",
                            "province": "จันทบุรี",
                            "zipCode": "22000"
                        }
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Error 400 (Invalid Bank Initial)",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "bankInitial has wrong format. Please recheck bankInitial again.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 (Invalid Type)",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Invalid Type.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 (บุคคลธรรมดา แต่ไม่แนบรูปคู่บัตร)",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Self picture is required for PERSON type",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "Error 400 (Invalid Input)",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Invalid input. Please review your details and try again.",
                        "name": "BadRequestException"
                    }
                }
            ]
        }
    ],
    "get-sender-cod": [
        {
            "code": "200",
            "description": "OK",
            "headers": [],
            "examples": [
                {
                    "name": "Get Sender COD",
                    "media": "text/plain",
                    "body": {
                        "data": [
                            {
                                "bankAccount": {
                                    "bankFullName": "ธนาคารกสิกรไทย (KBANK)",
                                    "bankInitial": "KBANK",
                                    "holderName": "มายเอกซ์เพลส น่ารัก",
                                    "number": "00000000011",
                                    "bookBankImage": "beta-mxp-bookbank-cod-image/mxp-bookbank-cod-image/662f048bfbd1db001302450e_1727885297312.jpg"
                                },
                                "approval": "PENDING",
                                "updateApprovalDate": "2024-10-08 23:08:18",
                                "note": "",
                                "name": "มายเอกซ์เพลส น่ารัก",
                                "phoneNumber": "0989392917",
                                "email": "myexpress.international@gmail.com",
                                "address": "123",
                                "subDistrict": "เกาะขวาง",
                                "district": "เมืองจันทบุรี",
                                "province": "จันทบุรี",
                                "zipCode": "22000"
                            }
                        ]
                    }
                },
                {
                    "name": "Success  (APPROVED)",
                    "media": "text/plain",
                    "body": {
                        "data": [
                            {
                                "bankAccount": {
                                    "bankFullName": "ธนาคารกสิกรไทย (KBANK)",
                                    "bankInitial": "KBANK",
                                    "holderName": "มายเอกซ์เพลส น่ารัก",
                                    "number": "00000000011",
                                    "bookBankImage": "beta-mxp-bookbank-cod-image/mxp-bookbank-cod-image/662f048bfbd1db001302450e_1727885297312.jpg"
                                },
                                "approval": "APPROVED",
                                "updateApprovalDate": "2024-10-08 23:08:18",
                                "note": "",
                                "name": "มายเอกซ์เพลส น่ารัก",
                                "phoneNumber": "0989392917",
                                "email": "myexpress.international@gmail.com",
                                "address": "123",
                                "subDistrict": "เกาะขวาง",
                                "district": "เมืองจันทบุรี",
                                "province": "จันทบุรี",
                                "zipCode": "22000"
                            }
                        ]
                    }
                },
                {
                    "name": "Success  (NOT_APPROVED)",
                    "media": "text/plain",
                    "body": {
                        "data": [
                            {
                                "bankAccount": {
                                    "bankFullName": "ธนาคารกสิกรไทย (KBANK)",
                                    "bankInitial": "KBANK",
                                    "holderName": "มายเอกซ์เพลส น่ารัก",
                                    "number": "00000000011",
                                    "bookBankImage": "beta-mxp-bookbank-cod-image/mxp-bookbank-cod-image/662f048bfbd1db001302450e_1727885297312.jpg"
                                },
                                "approval": "NOT_APPROVED",
                                "updateApprovalDate": "2024-10-08 23:08:18",
                                "note": "หนังสือรับรองบริษัทมีอายุเกิน 6 เดือน,มีข้อความ/ลายน้ำ ทับซ้อนข้อมูล",
                                "name": "มายเอกซ์เพลส น่ารัก",
                                "phoneNumber": "0989392917",
                                "email": "myexpress.international@gmail.com",
                                "address": "123",
                                "subDistrict": "เกาะขวาง",
                                "district": "เมืองจันทบุรี",
                                "province": "จันทบุรี",
                                "zipCode": "22000"
                            }
                        ]
                    }
                }
            ]
        },
        {
            "code": "400",
            "description": "Bad Request",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "Error 400 (Invalid search)",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Phone number or email not found.",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "ERROR 400 (Invalid phone number)",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Phone number invalid length",
                        "name": "BadRequestException"
                    }
                },
                {
                    "name": "ERROR 400 (Invalid email pattern)",
                    "media": "application/json",
                    "body": {
                        "status": 400,
                        "message": "Invalid email format",
                        "name": "BadRequestException"
                    }
                }
            ]
        },
        {
            "code": "404",
            "description": "Not Found",
            "headers": [
                {
                    "name": "Content-Type",
                    "type": "string",
                    "example": "application/json"
                }
            ],
            "examples": [
                {
                    "name": "",
                    "media": "application/json",
                    "body": {
                        "status": 404,
                        "message": "COD Account Not Found",
                        "name": "NotFoundException"
                    }
                }
            ]
        }
    ]
};