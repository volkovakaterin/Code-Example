'use client';

import { useEffect, useState } from 'react';
import styles from './OnboardingStepFour.module.scss';
import UploadImages from '../../UploadImages/UploadImages';
import FolderImages from '../../FolderImages/FolderImages';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { createObjectFromArray, reorderFiles } from '@/utils/reorder';
import React from 'react';
import { useOnboardingStore } from '@/store/onboardingPageStore';

export enum Folder {
    Facade = 'Фасад здания',
    Panorama = 'Панорама дома',
    Interior = 'Интерьер',
    View = 'Вид из окна',
    Kitchen = 'Кухня',
    Bathroom = 'Ванная',
}

export type FolderObject = {
    [key in Folder]: { [key: string]: { file: File; id: string }[] };
};

export const folderObject: FolderObject = {
    [Folder.Facade]: {},
    [Folder.Panorama]: {},
    [Folder.Interior]: {},
    [Folder.View]: {},
    [Folder.Kitchen]: {},
    [Folder.Bathroom]: {},
};

type Props = {
    visibleErrors: boolean;
    onVisibleError: () => void;
};

const minFiles = 5;

export const OnboardingStepFour = ({ visibleErrors, onVisibleError }: Props) => {
    const [selectFolder, setSelectFolder] = useState(Folder.Facade);
    const [windowWidth, setWindowWidth] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth : 0);
    const [dragging, setDragging] = useState(false);
    const { form, setForm, setFullness } = useOnboardingStore((state) => state.stepFour);

    let countCards = 3;
    if (windowWidth > 767) {
        countCards = 6;
    } else if (windowWidth > 1023) {
        countCards = 7;
    } else if (windowWidth > 1439) {
        countCards = 10;
    } else if (windowWidth > 1919) {
        countCards = 12;
    }

    const handleSelectFolder = (folder: Folder) => {
        setSelectFolder(folder);
    };

    const handleDeleteFiles = (id: string, folder: Folder) => {
        const mergedArray = Object.values(form[folder]).reduce((acc, val) => acc.concat(val), []);
        const newArr = mergedArray.filter((file) => file.id !== id);
        setForm(folder, createObjectFromArray(newArr, countCards));
    };

    const handleChangeFiles = (files: { [key: string]: { file: File; id: string }[] }, folder: Folder) => {
        setForm(folder, files);
    };

    const handleDropFiles = (result: DropResult) => {
        if (result) {
            const folderFiles = form[selectFolder];
            const files = reorderFiles(
                form[selectFolder],
                result.source,
                result.destination,
                result.draggableId,
                countCards
            );
            if (folderFiles && files) {
                setForm(selectFolder, files);
            } else {
                console.error(`Form data for folder ${selectFolder} is undefined.`);
            }
        }
    };

    const handleSetDragging = (drag: boolean) => {
        setDragging(drag);
    };

    useEffect(() => {
        let fileCount = 0;
        for (const folder of Object.values(Folder)) {
            const folderFiles = form[folder as keyof FolderObject];

            for (const key in folderFiles) {
                if (folderFiles.hasOwnProperty(key)) {
                    fileCount += folderFiles[key].length;
                    if (fileCount >= minFiles) {
                        setFullness(true);
                        onVisibleError();
                        break;
                    }
                }
            }
        }
        if (fileCount >= minFiles) {
            setFullness(true);
            onVisibleError();
        } else {
            setFullness(false);
        }
        console.log(form)
    }, [form]);

    return (
        <section className={`${styles.OnboardingStepFourSection} container`}>
            <DragDropContext
                onDragEnd={handleDropFiles}
                onDragStart={() => {
                    setDragging(true);
                }}
            >
                <UploadImages
                    files={form[selectFolder]}
                    folder={selectFolder}
                    onChangeFiles={handleChangeFiles}
                    onDeleteFiles={handleDeleteFiles}
                    dragging={dragging}
                    handleSetDragging={handleSetDragging}
                    countCards={countCards}
                />
            </DragDropContext>
            <div className={styles.wrapperFolderImages}>
                {Object.values(Folder).map((folder, index) => {
                    return (
                        <FolderImages
                            files={form[folder]}
                            title={folder}
                            index={index}
                            onSelectFolder={handleSelectFolder}
                            onDeleteFiles={handleDeleteFiles}
                            onChangeFiles={handleChangeFiles}
                            select={selectFolder}
                            windowWidth={windowWidth}
                            key={index}
                        />
                    );
                })}
            </div>
            {visibleErrors && <span className={styles.error}>Добавьте не менее 5-ти изображений</span>}
        </section>
    );
};
