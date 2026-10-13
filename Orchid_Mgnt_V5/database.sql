-- ============================================================================
-- SBA301 - Lab 05: Orchid Management System
-- Script SQL Server chuẩn hóa từ script của Giảng viên (Idempotent & Safe-to-run)
-- Kết nối CSDL: OrchidManagementDB (khớp với application.properties của Spring Boot)
-- ============================================================================

-- 1. TẠO CSDL OrchidManagementDB (Có kiểm tra tồn tại để tránh báo lỗi khi chạy lại)
IF DB_ID('OrchidManagementDB') IS NULL
BEGIN
    PRINT N'==> Đang tạo CSDL OrchidManagementDB...';
    CREATE DATABASE OrchidManagementDB;
END
ELSE
BEGIN
    PRINT N'==> CSDL OrchidManagementDB đã tồn tại.';
END
GO

-- (Tùy chọn: Nếu giảng viên yêu cầu có thêm SBA301_OrchidDB)
IF DB_ID('SBA301_OrchidDB') IS NULL
BEGIN
    CREATE DATABASE SBA301_OrchidDB;
END
GO

-- 2. CHỌN CSDL OrchidManagementDB ĐỂ LÀM VIỆC
USE OrchidManagementDB;
GO

-- 3. TẠO BẢNG Orchid NẾU CHƯA CÓ
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orchid')
BEGIN
    PRINT N'==> Đang tạo bảng Orchid...';
    CREATE TABLE Orchid (
        OrchidID            INT IDENTITY(1,1) PRIMARY KEY,
        OrchidName          NVARCHAR(150) NOT NULL,
        IsNatural           BIT NOT NULL,
        OrchidDescription   NVARCHAR(1000) NULL,
        OrchidCategory      NVARCHAR(100) NULL,
        IsAttractive        BIT NOT NULL,
        OrchidURL           NVARCHAR(1000) NULL
    );
    PRINT N'==> Tạo bảng Orchid thành công.';
END
ELSE
BEGIN
    PRINT N'==> Bảng Orchid đã tồn tại.';
END
GO

-- 4. CHÈN DỮ LIỆU TỪ GIÁO VIÊN CUNG CẤP
-- (Sử dụng kiểm tra tên để tránh bị nhân đôi dữ liệu nếu ấn Execute nhiều lần)

-- Đợt 1: Dữ liệu khởi tạo cơ bản
IF NOT EXISTS (SELECT 1 FROM Orchid WHERE OrchidName = N'Taichung Beauty')
BEGIN
    INSERT INTO Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N'Taichung Beauty', 1, N'Popular Cattleya orchid', N'Cattleya', 1, N'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800');
END

IF NOT EXISTS (SELECT 1 FROM Orchid WHERE OrchidName = N'Phalaenopsis White')
BEGIN
    INSERT INTO Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N'Phalaenopsis White', 1, N'White moth orchid', N'Phalaenopsis', 1, N'https://upload.wikimedia.org/wikipedia/commons/4/49/Phalaenopsis_Orchid.jpg');
END

IF NOT EXISTS (SELECT 1 FROM Orchid WHERE OrchidName = N'Dendrobium Purple')
BEGIN
    INSERT INTO Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES (N'Dendrobium Purple', 1, N'Purple dendrobium orchid', N'Dendrobium', 0, N'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cooktown_orchids_and_bud.jpg/500px-Cooktown_orchids_and_bud.jpg');
END

-- Đợt 2: Danh sách 10 loại hoa lan chi tiết kèm hình ảnh thực tế từ giảng viên
IF NOT EXISTS (SELECT 1 FROM Orchid WHERE OrchidName = N'White Phalaenopsis')
BEGIN
    INSERT INTO Orchid (OrchidName, IsNatural, OrchidDescription, OrchidCategory, IsAttractive, OrchidURL)
    VALUES
    (
        N'White Phalaenopsis',
        1,
        N'White Phalaenopsis moth orchid with a dark pink and yellow center.',
        N'Phalaenopsis',
        1,
        N'https://upload.wikimedia.org/wikipedia/commons/4/49/Phalaenopsis_Orchid.jpg'
    ),
    (
        N'Cattleya Trianaei',
        1,
        N'Large pale lavender Cattleya orchid with a ruffled magenta and yellow lip.',
        N'Cattleya',
        1,
        N'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=800'
    ),
    (
        N'Pink Dendrobium',
        1,
        N'Pink and white Dendrobium orchid with clusters of flowers along the stem.',
        N'Dendrobium',
        1,
        N'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800'
    ),
    (
        N'Cooktown Orchid',
        1,
        N'Purple Cooktown orchid, also known as Dendrobium bigibbum.',
        N'Dendrobium',
        1,
        N'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cooktown_orchids_and_bud.jpg/500px-Cooktown_orchids_and_bud.jpg'
    ),
    (
        N'Lady Slipper Orchid',
        1,
        N'Paphiopedilum orchid characterized by its distinctive slipper-shaped pouch.',
        N'Paphiopedilum',
        1,
        N'https://images.unsplash.com/photo-1524350876685-274059332603?w=800'
    ),
    (
        N'Dancing Lady Orchid',
        1,
        N'Yellow Oncidium orchid whose flowers resemble dancing ladies.',
        N'Oncidium',
        1,
        N'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800'
    ),
    (
        N'Orange Epidendrum',
        1,
        N'Orange Epidendrum orchid with clusters of vivid orange and yellow flowers.',
        N'Epidendrum',
        1,
        N'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=800'
    ),
    (
        N'Miltonia Pansy Orchid',
        1,
        N'Magenta and white Miltonia orchid commonly known as the pansy orchid.',
        N'Miltonia',
        1,
        N'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800'
    ),
    (
        N'Yellow Cymbidium',
        1,
        N'Yellow Cymbidium orchid with deep red markings on the flower lip.',
        N'Cymbidium',
        1,
        N'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800'
    ),
    (
        N'Pink Veined Phalaenopsis',
        0,
        N'Cultivated Phalaenopsis hybrid with pink veins and a deep magenta center.',
        N'Phalaenopsis Hybrid',
        1,
        N'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800'
    );
END
GO

-- 5. TRUY VẤN XEM KẾT QUẢ
SELECT DB_NAME() AS CurrentDatabase;
SELECT COUNT(*) AS TotalOrchidsInTable FROM Orchid;
SELECT TOP (1000)
    [OrchidID],
    [OrchidName],
    [IsNatural],
    [OrchidDescription],
    [OrchidCategory],
    [IsAttractive],
    [OrchidURL]
FROM [OrchidManagementDB].[dbo].[Orchid];
GO
