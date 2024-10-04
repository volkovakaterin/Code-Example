//Компонент папки с загруженными изображениями 

'use client';
import { useRef } from 'react';
import styles from './FolderImages.module.scss';
import Plus from '@/assets/icons/plus.svg';
import Image from 'next/image';
import Delete from '@/assets/icons/close_icon.svg';
import { Folder } from '../Onboarding/OnboardingStepFour/OnboardingStepFour';
import { nanoid } from 'nanoid';


interface FileObject {
    file: File;
    id: string;
}

interface FolderFiles {
    [key: string]: FileObject[];
}

interface FolderImagesProps {
    files: FolderFiles;
    title: Folder;
    onSelectFolder: (folder: any) => void;
    onDeleteFiles: (id: string, folder: Folder) => void;
    onChangeFiles: (files: { [key: string]: { file: File; id: string }[] }, folder: Folder) => void;
    select: string;
    windowWidth: number;
    index: number;
}

export default function FolderImages({
    files,
    title,
    onSelectFolder,
    onDeleteFiles,
    onChangeFiles,
    select,
    windowWidth,
    index,
}: FolderImagesProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleUploadClick = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesList = e.target.files;
        if (filesList && filesList.length > 0) {
            const newFilesArray: FileObject[] = Array.from(filesList).map((file) => ({
                file: file,
                id: nanoid(),
            }));
            onChangeFiles({ ...files, [title]: [...(files[title] || []), ...newFilesArray] }, title);
        }
    };

    const handleDelete = (id: string) => {
        onDeleteFiles(id, title);
    };

    let mergedArray: FileObject[] = Object.values(files).reduce<FileObject[]>((acc, val) => acc.concat(val), []);

    const filesVisible = windowWidth < 768 ? 3 : 4;
    mergedArray = mergedArray.slice(0, filesVisible);

    return (
        <div className={styles.FolderImages} key={index}>
            <div className={`${styles.wrapperFolder} ${select === title ? styles.select : ''}`}>
                <div className={styles.wrapperImages}>
                    {mergedArray.map((file) => (
                        <div className={styles.wrapperImage} key={file.id}>
                            <span className={styles.imageDelete} onClick={() => handleDelete(file.id)}>
                                <Delete />
                            </span>
                            <Image
                                src={URL.createObjectURL(file.file)}
                                alt={'img'}
                                width={121}
                                height={121}
                                className={styles.image}
                            />
                        </div>
                    ))}
                    <span className={styles.plus} onClick={handleUploadClick}>
                        <Plus />
                    </span>
                </div>
            </div>
            <div className={styles.wrapperTitle} onClick={() => onSelectFolder(title)}>
                <span>{title}</span>
            </div>
            <input
                type="file"
                multiple
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}
