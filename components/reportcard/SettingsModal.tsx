"use client";

import React from "react";

// Templates map import should be shared or re-imported
import ReportCartTemplateA from "@/components/reportcard/templates/ReportCartTemplateA";
import ReportCartTemplateB from "@/components/reportcard/templates/ReportCartTemplateB";
import ReportCartTemplateC from "@/components/reportcard/templates/ReportCartTemplateC";

const templates = {
    TemplateA: ReportCartTemplateA,
    TemplateB: ReportCartTemplateB,
    TemplateC: ReportCartTemplateC,
} as const;

export type TemplateKey = keyof typeof templates;

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    passingGrade: number;
    setPassingGrade: (value: number) => void;
    classMaster: string;
    setClassMaster: (value: string) => void;
    templateName: TemplateKey;
    setTemplateName: (value: TemplateKey) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    passingGrade,
    setPassingGrade,
    classMaster,
    setClassMaster,
    templateName,
    setTemplateName,
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Settings</h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    Configure your report card preferences
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        {/* Template Selection */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-900">
                                Report Card Template
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.keys(templates).map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => setTemplateName(name as TemplateKey)}
                                        className={`p-4 rounded-xl border-2 transition-all ${templateName === name
                                                ? "border-indigo-600 bg-indigo-50 shadow-md"
                                                : "border-gray-200 hover:border-gray-300 bg-white"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${templateName === name
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${templateName === name ? "text-indigo-600" : "text-gray-700"
                                                    }`}
                                            >
                                                {name}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Passing Grade */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-900">
                                Passing Grade Threshold
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min={0}
                                    max={20}
                                    step={0.5}
                                    value={passingGrade}
                                    onChange={(e) => setPassingGrade(parseFloat(e.target.value))}
                                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg border-2 border-indigo-200">
                                    <input
                                        type="number"
                                        min={0}
                                        max={20}
                                        step={0.5}
                                        value={passingGrade}
                                        onChange={(e) => setPassingGrade(parseFloat(e.target.value) || 0)}
                                        className="w-16 bg-transparent text-center text-lg font-bold text-indigo-600 focus:outline-none"
                                    />
                                    <span className="text-sm font-medium text-indigo-600">/ 20</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Students with an average of {passingGrade} or higher will be marked as passing
                            </p>
                        </div>

                        {/* Class Master */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-900">
                                Class Master Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter class master's name"
                                value={classMaster}
                                onChange={(e) => setClassMaster(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <p className="text-sm text-gray-600">
                                This name will appear on all generated report cards
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-200">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onSave();
                                    onClose();
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsModal;
