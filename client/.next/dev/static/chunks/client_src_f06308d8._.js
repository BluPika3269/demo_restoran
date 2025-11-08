(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/client/src/components/CalendarShowcase.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarShowcase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$react$2d$calendar$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/react-calendar/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$date$2d$fns$2f$isSameDay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/date-fns/isSameDay.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function CalendarShowcase({ appointments }) {
    _s();
    const [selectedDesign, setSelectedDesign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('classic');
    const getAppointmentsForDate = (date)=>{
        return appointments.filter((apt)=>{
            const aptDate = new Date(apt.date);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$date$2d$fns$2f$isSameDay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSameDay"])(aptDate, date);
        });
    };
    const getStatusCounts = (date)=>{
        const dayAppointments = getAppointmentsForDate(date);
        return {
            pending: dayAppointments.filter((a)=>a.status === 'pending').length,
            approved: dayAppointments.filter((a)=>a.status === 'approved').length,
            completed: dayAppointments.filter((a)=>a.status === 'completed').length,
            cancelled: dayAppointments.filter((a)=>a.status === 'cancelled').length,
            total: dayAppointments.length
        };
    };
    const calendarDesigns = [
        {
            id: 'classic',
            name: 'Klasični dizajn',
            description: 'Jednostavan dizajn sa pink točkicama za dane sa terminima',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const dayAppointments = getAppointmentsForDate(date);
                    if (dayAppointments.length > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mt-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-2 h-2 bg-pink-500 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 70,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 69,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            }
        },
        {
            id: 'numbered',
            name: 'Brojevni dizajn',
            description: 'Prikazuje broj termina u svakom danu',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const count = getAppointmentsForDate(date).length;
                    if (count > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mt-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold",
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 88,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 87,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            }
        },
        {
            id: 'status-colors',
            name: 'Boje po statusu',
            description: 'Različite boje za različite statuse termina',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const counts = getStatusCounts(date);
                    if (counts.total > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mt-1 space-x-1",
                            children: [
                                counts.pending > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-1.5 h-1.5 bg-yellow-400 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                    lineNumber: 108,
                                    columnNumber: 40
                                }, this),
                                counts.approved > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-1.5 h-1.5 bg-blue-500 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                    lineNumber: 109,
                                    columnNumber: 41
                                }, this),
                                counts.completed > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-1.5 h-1.5 bg-green-500 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                    lineNumber: 110,
                                    columnNumber: 42
                                }, this),
                                counts.cancelled > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-1.5 h-1.5 bg-red-500 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                    lineNumber: 111,
                                    columnNumber: 42
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 107,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            }
        },
        {
            id: 'gradient',
            name: 'Gradijent dizajn',
            description: 'Moderan dizajn sa gradijentima i brojevima',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const count = getAppointmentsForDate(date).length;
                    if (count > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mt-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm",
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 129,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 128,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            },
            tileClassName: ({ date, view })=>{
                if (view === 'month') {
                    const count = getAppointmentsForDate(date).length;
                    if (count > 0) {
                        return 'calendar-gradient-day';
                    }
                }
                return null;
            }
        },
        {
            id: 'minimal',
            name: 'Minimalistički dizajn',
            description: 'Čist dizajn sa suptilnim indikatorima',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const count = getAppointmentsForDate(date).length;
                    if (count > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mt-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-3 h-0.5 bg-gray-600 rounded-full opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 158,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 157,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            }
        },
        {
            id: 'detailed',
            name: 'Detaljni dizajn',
            description: 'Prikazuje broj termina i status indikatore',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const counts = getStatusCounts(date);
                    if (counts.total > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center mt-1 space-y-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs font-bold text-gray-700",
                                    children: counts.total
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                    lineNumber: 176,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex space-x-0.5",
                                    children: [
                                        counts.pending > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-1 h-1 bg-yellow-400 rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                            lineNumber: 178,
                                            columnNumber: 42
                                        }, this),
                                        counts.approved > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-1 h-1 bg-blue-400 rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                            lineNumber: 179,
                                            columnNumber: 43
                                        }, this),
                                        counts.completed > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-1 h-1 bg-green-400 rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                            lineNumber: 180,
                                            columnNumber: 44
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                    lineNumber: 177,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 175,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            }
        },
        {
            id: 'card-style',
            name: 'Card stil',
            description: 'Kalendar sa card-like dizajnom dana',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const counts = getStatusCounts(date);
                    if (counts.total > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-800",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center h-full text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-bold text-pink-600 dark:text-pink-400",
                                        children: counts.total
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 200,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex space-x-0.5 mt-0.5",
                                        children: [
                                            counts.pending > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1 h-1 bg-yellow-400 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                                lineNumber: 202,
                                                columnNumber: 44
                                            }, this),
                                            counts.approved > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1 h-1 bg-blue-400 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                                lineNumber: 203,
                                                columnNumber: 45
                                            }, this),
                                            counts.completed > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1 h-1 bg-green-400 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                                lineNumber: 204,
                                                columnNumber: 46
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 201,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 199,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 198,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            },
            tileClassName: ({ date, view })=>{
                if (view === 'month') {
                    const count = getAppointmentsForDate(date).length;
                    if (count > 0) {
                        return 'calendar-card-day';
                    }
                }
                return null;
            }
        },
        {
            id: 'neon',
            name: 'Neon dizajn',
            description: 'Svijetleći neon efekti za moderne salone',
            tileContent: ({ date, view })=>{
                if (view === 'month') {
                    const count = getAppointmentsForDate(date).length;
                    if (count > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mt-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 bg-pink-400 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-pink-400/50 border-2 border-pink-300",
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 233,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 232,
                            columnNumber: 15
                        }, this);
                    }
                }
                return null;
            }
        }
    ];
    const selectedDesignData = calendarDesigns.find((d)=>d.id === selectedDesign) || calendarDesigns[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-3bef550fa80597ce" + " " + "bg-white dark:bg-gray-800 rounded-lg shadow p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "jsx-3bef550fa80597ce" + " " + "text-2xl font-semibold text-gray-900 dark:text-white mb-6",
                children: "Dizajni kalendara - Odaberite svoj omiljeni"
            }, void 0, false, {
                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3bef550fa80597ce" + " " + "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8",
                children: calendarDesigns.map((design)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectedDesign(design.id),
                        className: "jsx-3bef550fa80597ce" + " " + `p-4 rounded-lg border-2 transition-all ${selectedDesign === design.id ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-pink-300'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "jsx-3bef550fa80597ce" + " " + "font-semibold text-gray-900 dark:text-white mb-2",
                                children: design.name
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-3bef550fa80597ce" + " " + "text-sm text-gray-600 dark:text-gray-400",
                                children: design.description
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 268,
                                columnNumber: 13
                            }, this)
                        ]
                    }, design.id, true, {
                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                lineNumber: 254,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3bef550fa80597ce" + " " + "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "jsx-3bef550fa80597ce" + " " + "text-xl font-semibold text-gray-900 dark:text-white mb-4",
                        children: [
                            "Pregled: ",
                            selectedDesignData.name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3bef550fa80597ce" + " " + "flex justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-3bef550fa80597ce" + " " + "calendar-container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$react$2d$calendar$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                value: new Date(),
                                tileContent: selectedDesignData.tileContent,
                                tileClassName: selectedDesignData.tileClassName,
                                className: "border rounded-lg shadow-lg"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-3bef550fa80597ce" + " " + "bg-gray-50 dark:bg-gray-700 rounded-lg p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "jsx-3bef550fa80597ce" + " " + "font-semibold text-gray-900 dark:text-white mb-3",
                        children: "Legenda:"
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-3bef550fa80597ce" + " " + "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3bef550fa80597ce" + " " + "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3bef550fa80597ce" + " " + "w-3 h-3 bg-yellow-400 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 297,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-3bef550fa80597ce" + " " + "text-gray-700 dark:text-gray-300",
                                        children: "Na čekanju"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3bef550fa80597ce" + " " + "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3bef550fa80597ce" + " " + "w-3 h-3 bg-blue-500 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-3bef550fa80597ce" + " " + "text-gray-700 dark:text-gray-300",
                                        children: "Potvrđen"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3bef550fa80597ce" + " " + "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3bef550fa80597ce" + " " + "w-3 h-3 bg-green-500 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 305,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-3bef550fa80597ce" + " " + "text-gray-700 dark:text-gray-300",
                                        children: "Završen"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 306,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-3bef550fa80597ce" + " " + "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-3bef550fa80597ce" + " " + "w-3 h-3 bg-red-500 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-3bef550fa80597ce" + " " + "text-gray-700 dark:text-gray-300",
                                        children: "Otkazan"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                        lineNumber: 310,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/components/CalendarShowcase.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "3bef550fa80597ce",
                children: ".calendar-container .react-calendar{background:#fff;border:1px solid #e5e7eb;border-radius:.5rem;width:100%;max-width:100%;padding:1rem;font-family:inherit}.dark .calendar-container .react-calendar{color:#f3f4f6;background:#1f2937;border:1px solid #4b5563}.calendar-container .react-calendar__navigation{background:0 0}.dark .calendar-container .react-calendar__navigation button{color:#f3f4f6}.calendar-container .react-calendar__navigation button:enabled:hover,.calendar-container .react-calendar__navigation button:enabled:focus{background-color:#f3f4f6}.dark .calendar-container .react-calendar__navigation button:enabled:hover,.dark .calendar-container .react-calendar__navigation button:enabled:focus{background-color:#374151}.calendar-container .react-calendar__month-view__weekdays__weekday{color:#6b7280}.dark .calendar-container .react-calendar__month-view__weekdays__weekday{color:#9ca3af}.calendar-container .react-calendar__tile{color:#111827;background:#fff;padding:.75em .5em;position:relative}.dark .calendar-container .react-calendar__tile{color:#f3f4f6;background:#1f2937}.calendar-container .react-calendar__tile:enabled:hover,.calendar-container .react-calendar__tile:enabled:focus{background:#f3f4f6}.dark .calendar-container .react-calendar__tile:enabled:hover,.dark .calendar-container .react-calendar__tile:enabled:focus{background:#374151}.calendar-container .react-calendar__tile--active{color:#fff!important;background:#ec4899!important}.calendar-container .react-calendar__tile--active:enabled:hover,.calendar-container .react-calendar__tile--active:enabled:focus{background:#db2777!important}.calendar-gradient-day{background:linear-gradient(135deg,#ec48991a,#a855f71a)!important;border-radius:8px!important}.calendar-card-day{position:relative!important;overflow:hidden!important}.calendar-card-day .react-calendar__tile{position:relative!important}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/CalendarShowcase.tsx",
        lineNumber: 248,
        columnNumber: 5
    }, this);
}
_s(CalendarShowcase, "eBtzqxvxlRmOpnt3UsrVlVdXQKQ=");
_c = CalendarShowcase;
var _c;
__turbopack_context__.k.register(_c, "CalendarShowcase");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/app/calendar-demo/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarDemo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$CalendarShowcase$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/CalendarShowcase.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
function CalendarDemo() {
    _s();
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarDemo.useEffect": ()=>{
            fetchAppointments();
        }
    }["CalendarDemo.useEffect"], []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4",
                            children: "Dizajni kalendara za admin panel"
                        }, void 0, false, {
                            fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$CalendarShowcase$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    appointments: appointments
                }, void 0, false, {
                    fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-2xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2",
                                children: "Kako implementirati odabrani dizajn?"
                            }, void 0, false, {
                                fileName: "[project]/client/src/app/calendar-demo/page.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(CalendarDemo, "MfWojYlbX9MgZ4Hbt1nSvX/pcQY=");
_c = CalendarDemo;
var _c;
__turbopack_context__.k.register(_c, "CalendarDemo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=client_src_f06308d8._.js.map