CREATE TABLE `attendance_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `sessionDate` DATE NOT NULL,
    `division` ENUM('CHILDREN', 'INTERMEDIATE', 'YOUTH') NOT NULL,
    `groupName` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `className` VARCHAR(191) NOT NULL,
    `sessionType` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `att_session_identity_key`(`sessionDate`, `division`, `groupName`, `className`, `sessionType`),
    INDEX `attendance_sessions_division_sessionDate_idx`(`division`, `sessionDate`),
    INDEX `attendance_sessions_className_sessionDate_idx`(`className`, `sessionDate`),
    PRIMARY KEY (`id`),
    CONSTRAINT `attendance_sessions_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `attendance_records` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `status` ENUM('PRESENT', 'ABSENT') NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `attendance_records_sessionId_memberId_key`(`sessionId`, `memberId`),
    INDEX `attendance_records_memberId_status_idx`(`memberId`, `status`),
    PRIMARY KEY (`id`),
    CONSTRAINT `attendance_records_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `attendance_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `attendance_records_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `member_registrations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `attendance_corrections` (
    `id` VARCHAR(191) NOT NULL,
    `attendanceRecordId` VARCHAR(191) NOT NULL,
    `previousStatus` ENUM('PRESENT', 'ABSENT') NOT NULL,
    `newStatus` ENUM('PRESENT', 'ABSENT') NOT NULL,
    `reason` TEXT NOT NULL,
    `correctedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `attendance_corrections_attendanceRecordId_createdAt_idx`(`attendanceRecordId`, `createdAt`),
    PRIMARY KEY (`id`),
    CONSTRAINT `attendance_corrections_attendanceRecordId_fkey` FOREIGN KEY (`attendanceRecordId`) REFERENCES `attendance_records`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `attendance_corrections_correctedById_fkey` FOREIGN KEY (`correctedById`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;