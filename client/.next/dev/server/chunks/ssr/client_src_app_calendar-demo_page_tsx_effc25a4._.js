module.exports = [
"[project]/client/src/app/calendar-demo/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarDemo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/CalendarShowcase'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
'use client';
;
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
function CalendarDemo() {
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchAppointments();
    }, []);
    const fetchAppointments = async ()=>{
        try {
            const response = await fetch(`${API_URL}/admin/appointments`);
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Fallback demo data
            setAppointments([
                {
                    id: 1,
                    serviceId: 1,
                    date: '2025-11-08',
                    time: '10:00',
                    customerName: 'Ana Anić',
                    customerEmail: 'ana@example.com',
                    customerPhone: '+385 91 123 4567',
                    notes: 'Francuski manikir',
                    status: 'approved',
                    service: {
                        id: 1,
                        name: 'Francuski manikir',
                        price: 15,
                        duration: 60
                    }
                },
                {
                    id: 2,
                    serviceId: 2,
                    date: '2025-11-08',
                    time: '14:00',
                    customerName: 'Marija Marić',
                    customerEmail: 'marija@example.com',
                    customerPhone: '+385 91 234 5678',
                    notes: 'Gel lak',
                    status: 'pending',
                    service: {
                        id: 2,
                        name: 'Gel lak',
                        price: 20,
                        duration: 90
                    }
                },
                {
                    id: 3,
                    serviceId: 3,
                    date: '2025-11-10',
                    time: '11:00',
                    customerName: 'Ivana Ivanić',
                    customerEmail: 'ivana@example.com',
                    customerPhone: '+385 91 345 6789',
                    notes: 'Nail art',
                    status: 'completed',
                    service: {
                        id: 3,
                        name: 'Nail art',
                        price: 25,
                        duration: 120
                    }
                },
                {
                    id: 4,
                    serviceId: 1,
                    date: '2025-11-12',
                    time: '09:00',
                    customerName: 'Petra Petrović',
                    customerEmail: 'petra@example.com',
                    customerPhone: '+385 91 456 7890',
                    notes: 'Francuski manikir',
                    status: 'cancelled',
                    service: {
                        id: 1,
                        name: 'Francuski manikir',
                        price: 15,
                        duration: 60
                    }
                },
                {
                    id: 5,
                    serviceId: 4,
                    date: '2025-11-15',
                    time: '16:00',
                    customerName: 'Katarina Katić',
                    customerEmail: 'katarina@example.com',
                    customerPhone: '+385 91 567 8901',
                    notes: 'Akrylne nokte',
                    status: 'approved',
                    service: {
                        id: 4,
                        name: 'Akrylne nokte',
                        price: 35,
                        duration: 150
                    }
                }
            ]);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4",
                            children: "Dizajni kalendara za admin panel"
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto",
                            children: "Odaberite dizajn kalendara koji vam se najviše sviđa za vaš admin dashboard. Svaki dizajn prikazuje termine na drugačiji način."
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarShowcase, {
                    appointments: appointments
                }, void 0, false, {
                    fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2",
                                children: "Kako implementirati odabrani dizajn?"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-blue-800 dark:text-blue-200",
                                children: "Jednostavno mi recite koji dizajn vam se sviđa i ja ću ga implementirati u vaš admin dashboard. Dizajn će biti integriran sa postojećom funkcionalnošću za upravljanje terminima."
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/app/calendar-demo/page.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/app/calendar-demo/page.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=client_src_app_calendar-demo_page_tsx_effc25a4._.js.map