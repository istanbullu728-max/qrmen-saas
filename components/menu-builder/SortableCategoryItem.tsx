
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React, { createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { GripVertical } from "lucide-react"

const DragHandleContext = createContext<any>(null)

export function SortableCategoryItem({ category, children }: { category: any, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: category.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as 'relative'
    }

    return (
        <DragHandleContext.Provider value={{ attributes, listeners }}>
            <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : ""}>
                {children}
            </div>
        </DragHandleContext.Provider>
    )
}

export function DragHandleButton() {
    const { attributes, listeners } = useContext(DragHandleContext) || {}
    return (
        <Button
            variant="ghost"
            size="icon"
            className="cursor-move h-10 w-10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
            {...attributes}
            {...listeners}
        >
            <GripVertical className="h-5 w-5" />
        </Button>
    )
}
