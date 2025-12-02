import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { useFormActions } from '../../contexts/FormActionsContext';
import { useUIState } from '../../contexts/UIStateContext';
import { selectFormElements, selectFormById } from '../../store/selectors';
import { FormElement } from './FormElement';
import { useDispatch } from 'react-redux';
import { reorderFormElements } from '../../store/slices/formBuilderSlice';
import './FormCanvas.css';

export const FormCanvas = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const { setSelectedElementId } = useUIState();
  const elements = useSelector(selectFormElements);
  const form = useSelector(state => selectFormById(state, formId));
  const { removeElement } = useFormActions();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = elements.findIndex((item) => item.id === active.id);
      const newIndex = elements.findIndex((item) => item.id === over.id);
      
      dispatch(reorderFormElements({
        formId,
        startIndex: oldIndex,
        endIndex: newIndex,
      }));
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };

  if (!form) {
    return (
      <div className="form-canvas-empty">
        <div className="empty-state">
          <h3>No form selected</h3>
          <p>Select a form from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-canvas" onClick={handleCanvasClick}>
      <div className="form-header">
        <h1 className="form-title">{form.title}</h1>
        <p className="form-description">
          Build your form by adding elements from the sidebar
        </p>
      </div>

      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={elements.map(el => el.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="elements-container">
            {elements.map((element, index) => (
              <FormElement
                key={element.id}
                element={element}
                index={index}
                onDelete={() => removeElement(element.id)}
              />
            ))}
            
            {elements.length === 0 && (
              <div className="empty-canvas">
                <div className="empty-canvas-content">
                  <h3>No elements yet</h3>
                  <p>Drag elements from the sidebar to start building your form</p>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};