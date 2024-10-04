//Компонент загрузки изображений drag and drop в контейнер, перемещение загруженных изображений для изменения их очередности 

'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './UploadImages.module.scss';
import { Folder } from '../Onboarding/OnboardingStepFour/OnboardingStepFour';
import DraggableCard from '../DraggableCard/DraggableCard';
import { nanoid } from 'nanoid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { uploadImages } from '@/utils/uploadingImages';
import { hasElements } from '@/utils/hasElements';

interface Props {
    onChangeFiles: (files: { [key: string]: { file: File; id: string }[] }, folder: Folder) => void;
    onDeleteFiles: (id: string, folder: Folder) => void;
    handleSetDragging: (drag: boolean) => void;
    files: { [key: string]: { file: File; id: string }[] };
    folder: Folder;
    dragging: boolean;
    countCards: number;
}

export default function UploadImages({
    onChangeFiles,
    onDeleteFiles,
    handleSetDragging,
    files,
    folder,
    dragging,
    countCards,
}: Props) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentFolder, setCurrentFolder] = useState(folder);
    const [currentFiles, setCurrentFiles] = useState(files);
    const maxPictures = 12;

    useEffect(() => {
        setCurrentFolder(folder);
        setCurrentFiles(files);
    }, [folder, files]);

    const filesId = (files: File[]) => {
        const newArr: { file: File; id: string }[] = [];
        files.map((item) => {
            const withId = { file: item, id: nanoid() };
            newArr.push(withId);
        });
        return newArr;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const mergedArray = Object.values(currentFiles).reduce((acc, val) => acc.concat(val), []);
        if (mergedArray.length < maxPictures) {
            const files = e.target.files;
            if (files && files.length > 0) {
                const arr = filesId(Array.from(files));
                const updatedFiles = uploadImages(arr, currentFiles, countCards, maxPictures);
                if (updatedFiles) {
                    onChangeFiles(updatedFiles, currentFolder);
                } else {
                    console.error('Ошибка при загрузке изображений');
                }
            }
        }
        return;
    };

    const handleUploadImagesClick = (e: any) => {
        if (!dragging) {
            if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.click();
            }
        } else handleSetDragging(false);
    };

    const handleDelete = (id: string) => {
        onDeleteFiles(id, currentFolder);
    };

    const handleEnter = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDragActive(true);
    };

    const handleOver = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDragActive(true);
    };

    const handleLeave = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setDragActive(false);
        const mergedArray = Object.values(currentFiles).reduce((acc, val) => acc.concat(val), []);
        if (mergedArray.length < maxPictures) {
            const files = e.dataTransfer.files;
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const arr = filesId(Array.from(files));
                const updatedFiles = uploadImages(arr, currentFiles, countCards, maxPictures);
                if (updatedFiles) {
                    onChangeFiles(updatedFiles, currentFolder);
                } else {
                    console.error('Ошибка при загрузке изображений');
                }
            }
        }
        return;
    };

    return (
        <div
            className={styles.UploadImages}
            onDragEnter={(e) => handleEnter(e)}
            onDragOver={handleOver}
            onDragLeave={handleLeave}
            onDrop={handleDrop}
            onClick={(e) => handleUploadImagesClick(e)}
        >
            <form className={`${styles.uploadContainer} ${dragActive ? styles.active : false}`} data-container="drop">
                {hasElements(currentFiles)
                    ? Object.entries(currentFiles).map(([k, v]) => (
                        <Droppable
                            droppableId={k}
                            type={'CARD'}
                            direction="horizontal"
                            isCombineEnabled={false}
                            key={k}
                        >
                            {(dropProvided) => (
                                <div
                                    {...dropProvided.droppableProps}
                                    ref={dropProvided.innerRef}
                                    className={styles.droppableRow}
                                    key={k}
                                >
                                    {v.length
                                        ? v.map((file, index) => (
                                            <Draggable key={file.id} index={index} draggableId={file.id}>
                                                {(dragProvided) => (
                                                    <DraggableCard
                                                        provided={dragProvided}
                                                        file={file}
                                                        id={file.id}
                                                        allFiles={v}
                                                        handleDelete={handleDelete}
                                                        key={file.id}
                                                    />
                                                )}
                                            </Draggable>
                                        ))
                                        : false}

                                    {dropProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))
                    : false}
                {!hasElements(currentFiles) ? <p>Перетащите сюда файлы или выберите на устройстве </p> : false}
                <input
                    type="file"
                    multiple={true}
                    accept=".pdf, .jpg, .jpeg, .heic"
                    onChange={(e) => {
                        handleInputChange(e);
                    }}
                    ref={inputRef}
                    style={{ display: 'none' }}
                />
            </form>
        </div>
    );
}
