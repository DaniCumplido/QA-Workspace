import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function SlideOver({ open, onClose, onSave, title, children, isSubmitting = false }) {
    return (
        <>
            <Dialog open={open} onClose={onClose} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 transition-opacity duration-500 ease-in-out bg-gray-900/50 data-closed:opacity-0"
                />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none sm:pl-16">
                            <DialogPanel
                                transition
                                className="relative w-screen max-w-md transition duration-500 ease-in-out transform pointer-events-auto data-closed:translate-x-full sm:duration-700"
                            >
                                <TransitionChild>
                                    <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="relative text-gray-400 rounded-md hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                        >
                                            <span className="absolute -inset-2.5" />
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon aria-hidden="true" className="size-6" />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <div className="relative flex flex-col h-full py-6 overflow-y-auto bg-gray-800 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10">
                                    <div className="px-4 sm:px-6">
                                        <DialogTitle className="text-base font-semibold text-white">{title}</DialogTitle>
                                    </div>
                                    <div className="relative flex-1 px-4 mt-6 sm:px-6">
                                        <form onSubmit={onSave}>
                                            <div className="space-y-12">
                                                <div className="pb-12 border-b border-white/10">
                                                    {children}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end mt-6 gap-x-6">
                                                <button
                                                    onClick={onClose}
                                                    type="button" className="font-semibold text-white text-sm/6">
                                                    Cancelar
                                                </button>
                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="px-3 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                                >
                                                    {isSubmitting ? "Guardando..." : "Guardar"}
                                                </button>
                                            </div>
                                        </form >
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}