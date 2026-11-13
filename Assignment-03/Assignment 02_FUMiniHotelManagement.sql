USE [master]
GO

CREATE DATABASE [FUMiniHotelManagement]
GO
USE [FUMiniHotelManagement]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoomInformation](
	[RoomID] [int] IDENTITY(1,1) NOT NULL,
	[RoomNumber] [nvarchar](50) NOT NULL,
	[RoomDetailDescription] [nvarchar](220) NULL,
	[RoomMaxCapacity] [int] NULL,
	[RoomTypeID] [int] NOT NULL,
	[RoomStatus] [tinyint] NULL,
	[RoomPricePerDay] [money] NULL,
 CONSTRAINT [PK_RoomInformation] PRIMARY KEY CLUSTERED 
(
	[RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[CustomerID] [int] IDENTITY(3,1) NOT NULL,
	[CustomerFullName] [nvarchar](50) NULL,
	[Telephone] [nvarchar](12) NULL,
	[EmailAddress] [nvarchar](50) NOT NULL Unique,
	[CustomerBirthday] [date] NULL,
	[CustomerStatus] [tinyint] NULL,
	[Password] [nvarchar](50) NULL,
 CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
(
	[CustomerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoomType](
	[RoomTypeID] [int] IDENTITY(1,1) NOT NULL,
	[RoomTypeName] [nvarchar](50) NOT NULL,
	[TypeDescription] [nvarchar](250) NULL,
	[TypeNote] [nvarchar](250) NULL,
 CONSTRAINT [PK_RoomType] PRIMARY KEY CLUSTERED 
(
	[RoomTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BookingDetail](
	[BookingReservationID] [int] NOT NULL,
	[RoomID] [int] NOT NULL,
	[StartDate] [date] NOT NULL,
	[EndDate] [date] NOT NULL,
	[ActualPrice] [money] NULL,
 CONSTRAINT [PK_BookingDetail] PRIMARY KEY CLUSTERED 
(
	[BookingReservationID] ASC,
	[RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BookingReservation](
	[BookingReservationID] [int] NOT NULL,
	[BookingDate] [date] NULL,
	[TotalPrice] [money] NULL,
	[CustomerID] [int] NOT NULL,
	[BookingStatus] [tinyint] NULL,
 CONSTRAINT [PK_BookingReservation] PRIMARY KEY CLUSTERED 
(
	[BookingReservationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

GO
ALTER TABLE [dbo].[RoomInformation]  WITH CHECK ADD  CONSTRAINT [FK_RoomInformation_RoomType] FOREIGN KEY([RoomTypeID])
REFERENCES [dbo].[RoomType] ([RoomTypeID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoomInformation] CHECK CONSTRAINT [FK_RoomInformation_RoomType]
GO

ALTER TABLE [dbo].[BookingDetail]  WITH CHECK ADD  CONSTRAINT [FK_BookingDetail_RoomInformation] FOREIGN KEY([RoomID])
REFERENCES [dbo].[RoomInformation] ([RoomID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BookingDetail] CHECK CONSTRAINT [FK_BookingDetail_RoomInformation]
GO
ALTER TABLE [dbo].[BookingDetail]  WITH CHECK ADD  CONSTRAINT [FK_BookingDetail_BookingReservation] FOREIGN KEY([BookingReservationID])
REFERENCES [dbo].[BookingReservation] ([BookingReservationID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BookingDetail] CHECK CONSTRAINT [FK_BookingDetail_BookingReservation]
GO
ALTER TABLE [dbo].[BookingReservation]  WITH CHECK ADD  CONSTRAINT [FK_BookingReservation_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[BookingReservation] CHECK CONSTRAINT [FK_BookingReservation_Customer]
GO

-- ====================================================================
-- INSERT SAMPLE DATA (DỮ LIỆU MẪU KIỂM THỬ)
-- ====================================================================

-- 1. Insert RoomType
SET IDENTITY_INSERT [dbo].[RoomType] ON;
INSERT INTO [dbo].[RoomType] ([RoomTypeID], [RoomTypeName], [TypeDescription], [TypeNote]) VALUES
(1, N'Standard Room', N'Phòng tiêu chuẩn ấm cúng, đầy đủ tiện nghi cơ bản cho 1-2 người', N'Standard floor 2-3'),
(2, N'Superior Room', N'Phòng cao cấp hướng vườn hoặc thành phố, ban công thoáng mát', N'Superior floor 4-5'),
(3, N'Deluxe Room', N'Phòng sang trọng với bồn tắm nằm, giường King-size cao cấp', N'Deluxe floor 6-7'),
(4, N'Suite President', N'Phòng tổng thống thượng lưu có phòng khách riêng biệt và quầy bar mini', N'VIP floor 8');
SET IDENTITY_INSERT [dbo].[RoomType] OFF;
GO

-- 2. Insert Customer (Mật khẩu mặc định: 123456)
SET IDENTITY_INSERT [dbo].[Customer] ON;
INSERT INTO [dbo].[Customer] ([CustomerID], [CustomerFullName], [Telephone], [EmailAddress], [CustomerBirthday], [CustomerStatus], [Password]) VALUES
(1, N'Nguyễn Văn An', N'0901234567', N'customer@hotel.com', '1998-05-15', 1, N'123456'),
(2, N'Trần Thị Bích', N'0912345678', N'bichtran@gmail.com', '2000-08-20', 1, N'123456'),
(3, N'Lê Hoàng Long', N'0987654321', N'longle@gmail.com', '1995-12-10', 1, N'123456'),
(4, N'Phạm Minh Đức', N'0934567890', N'ducpham@gmail.com', '1997-03-25', 1, N'123456');
SET IDENTITY_INSERT [dbo].[Customer] OFF;
GO

-- 3. Insert RoomInformation
SET IDENTITY_INSERT [dbo].[RoomInformation] ON;
INSERT INTO [dbo].[RoomInformation] ([RoomID], [RoomNumber], [RoomDetailDescription], [RoomMaxCapacity], [RoomTypeID], [RoomStatus], [RoomPricePerDay]) VALUES
(1, N'101', N'Phòng Standard view đường phố yên tĩnh, 1 giường đôi', 2, 1, 1, 350000),
(2, N'102', N'Phòng Standard view ban công thoáng mát, 2 giường đơn', 2, 1, 1, 380000),
(3, N'201', N'Phòng Superior hướng công viên, bàn làm việc rộng rãi', 3, 2, 1, 550000),
(4, N'202', N'Phòng Superior không gian mở, trang thiết bị hiện đại', 3, 2, 1, 580000),
(5, N'301', N'Phòng Deluxe sang trọng, bồn tắm view đẹp lãng mạn', 2, 3, 1, 850000),
(6, N'302', N'Phòng Deluxe phong cách hoàng gia, minibar cao cấp', 2, 3, 1, 900000),
(7, N'401', N'Suite President đẳng cấp thương gia, phòng khách riêng biệt', 4, 4, 1, 1500000);
SET IDENTITY_INSERT [dbo].[RoomInformation] OFF;
GO

-- 4. Insert BookingReservation (Phòng 101 và 201 đã có lịch sử thuê -> kiểm tra quy tắc xóa phòng)
INSERT INTO [dbo].[BookingReservation] ([BookingReservationID], [BookingDate], [TotalPrice], [CustomerID], [BookingStatus]) VALUES
(1, '2026-11-01', 700000, 1, 1),
(2, '2026-11-03', 1100000, 2, 2);
GO

-- 5. Insert BookingDetail
INSERT INTO [dbo].[BookingDetail] ([BookingReservationID], [RoomID], [StartDate], [EndDate], [ActualPrice]) VALUES
(1, 1, '2026-11-05', '2026-11-07', 700000),
(2, 3, '2026-11-10', '2026-11-12', 1100000);
GO
USE [master]
GO
ALTER DATABASE [FUMiniHotelManagement] SET  READ_WRITE 
GO
