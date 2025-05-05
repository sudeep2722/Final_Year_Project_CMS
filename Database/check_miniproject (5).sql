-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 30, 2025 at 07:17 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `check_miniproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'admin', '$2b$10$6RemXDYYjpshcN0L3BsCseOgEFWTfNstB5msz9lvA9C0S77hrIOMS', '2025-03-09 18:59:10');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `subject_id`, `semester_id`, `title`, `description`, `due_date`, `created_at`) VALUES
(1, 1, 1, 'checking assignment', 'desc', '2024-12-20', '2024-12-17 22:41:35'),
(2, 1, 1, 'hdjshdkf', 'bhjfdhfds', '2024-12-20', '2024-12-18 00:52:23'),
(3, 1, 1, 'college assignment', 'submit assignment', '2024-12-19', '2024-12-18 06:58:04'),
(4, 1, 1, '1st sem assignment', 'this is an assignment', '2024-12-20', '2024-12-18 07:41:55'),
(5, 1, 1, '1st assignment', 'hello world', '2024-12-20', '2024-12-19 20:38:59'),
(6, 1, 1, 'Today assignment', 'It is a assignment', '2025-02-23', '2025-02-23 14:13:11'),
(7, 6, 2, 'Chem 1', '1st assignment ', '2025-02-28', '2025-02-26 20:19:09'),
(8, 1, 1, 'New assignment', 'This is a assignment', '2025-04-30', '2025-04-28 20:05:10');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_records`
--

CREATE TABLE `attendance_records` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('Present','Absent','Late') NOT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_records`
--

INSERT INTO `attendance_records` (`id`, `student_id`, `subject_id`, `date`, `status`, `recorded_at`) VALUES
(78, 1010, 1, '2025-03-16', 'Absent', '2025-03-16 10:02:41'),
(79, 1011, 1, '2025-03-16', 'Present', '2025-03-16 10:02:41'),
(80, 1012, 1, '2025-03-16', 'Absent', '2025-03-16 10:02:41'),
(81, 1013, 1, '2025-03-16', 'Present', '2025-03-16 10:02:41'),
(82, 1014, 1, '2025-03-16', 'Present', '2025-03-16 10:02:41'),
(83, 1015, 1, '2025-03-16', 'Absent', '2025-03-16 10:02:41'),
(84, 1018, 1, '2025-03-16', 'Present', '2025-03-16 10:02:41'),
(85, 1020, 1, '2025-03-16', 'Present', '2025-03-16 10:02:41'),
(86, 1010, 3, '2025-03-16', 'Absent', '2025-03-16 10:02:51'),
(87, 1011, 3, '2025-03-16', 'Present', '2025-03-16 10:02:51'),
(88, 1012, 3, '2025-03-16', 'Absent', '2025-03-16 10:02:51'),
(89, 1013, 3, '2025-03-16', 'Present', '2025-03-16 10:02:51'),
(90, 1014, 3, '2025-03-16', 'Present', '2025-03-16 10:02:51'),
(91, 1015, 3, '2025-03-16', 'Absent', '2025-03-16 10:02:51'),
(92, 1018, 3, '2025-03-16', 'Present', '2025-03-16 10:02:51'),
(93, 1020, 3, '2025-03-16', 'Present', '2025-03-16 10:02:51'),
(94, 1010, 4, '2025-03-16', 'Absent', '2025-03-16 10:02:56'),
(95, 1011, 4, '2025-03-16', 'Present', '2025-03-16 10:02:56'),
(96, 1012, 4, '2025-03-16', 'Absent', '2025-03-16 10:02:56'),
(97, 1013, 4, '2025-03-16', 'Present', '2025-03-16 10:02:56'),
(98, 1014, 4, '2025-03-16', 'Present', '2025-03-16 10:02:56'),
(99, 1015, 4, '2025-03-16', 'Absent', '2025-03-16 10:02:56'),
(100, 1018, 4, '2025-03-16', 'Present', '2025-03-16 10:02:56'),
(101, 1020, 4, '2025-03-16', 'Present', '2025-03-16 10:02:56'),
(102, 1010, 5, '2025-03-16', 'Absent', '2025-03-16 10:03:00'),
(103, 1011, 5, '2025-03-16', 'Present', '2025-03-16 10:03:00'),
(104, 1012, 5, '2025-03-16', 'Absent', '2025-03-16 10:03:00'),
(105, 1013, 5, '2025-03-16', 'Present', '2025-03-16 10:03:00'),
(106, 1014, 5, '2025-03-16', 'Present', '2025-03-16 10:03:00'),
(107, 1015, 5, '2025-03-16', 'Absent', '2025-03-16 10:03:00'),
(108, 1018, 5, '2025-03-16', 'Present', '2025-03-16 10:03:00'),
(109, 1020, 5, '2025-03-16', 'Present', '2025-03-16 10:03:00'),
(110, 1010, 118, '2025-03-16', 'Absent', '2025-03-16 10:03:03'),
(111, 1011, 118, '2025-03-16', 'Present', '2025-03-16 10:03:03'),
(112, 1012, 118, '2025-03-16', 'Absent', '2025-03-16 10:03:03'),
(113, 1013, 118, '2025-03-16', 'Present', '2025-03-16 10:03:03'),
(114, 1014, 118, '2025-03-16', 'Present', '2025-03-16 10:03:03'),
(115, 1015, 118, '2025-03-16', 'Absent', '2025-03-16 10:03:03'),
(116, 1018, 118, '2025-03-16', 'Present', '2025-03-16 10:03:03'),
(117, 1020, 118, '2025-03-16', 'Present', '2025-03-16 10:03:03'),
(118, 1010, 118, '2025-03-17', 'Present', '2025-03-16 10:03:28'),
(119, 1011, 118, '2025-03-17', 'Absent', '2025-03-16 10:03:28'),
(120, 1012, 118, '2025-03-17', 'Absent', '2025-03-16 10:03:28'),
(121, 1013, 118, '2025-03-17', 'Absent', '2025-03-16 10:03:28'),
(122, 1014, 118, '2025-03-17', 'Present', '2025-03-16 10:03:28'),
(123, 1015, 118, '2025-03-17', 'Present', '2025-03-16 10:03:28'),
(124, 1018, 118, '2025-03-17', 'Present', '2025-03-16 10:03:28'),
(125, 1020, 118, '2025-03-17', 'Absent', '2025-03-16 10:03:28'),
(126, 1010, 5, '2025-03-17', 'Present', '2025-03-16 10:03:36'),
(127, 1011, 5, '2025-03-17', 'Absent', '2025-03-16 10:03:36'),
(128, 1012, 5, '2025-03-17', 'Absent', '2025-03-16 10:03:36'),
(129, 1013, 5, '2025-03-17', 'Absent', '2025-03-16 10:03:36'),
(130, 1014, 5, '2025-03-17', 'Present', '2025-03-16 10:03:36'),
(131, 1015, 5, '2025-03-17', 'Present', '2025-03-16 10:03:36'),
(132, 1018, 5, '2025-03-17', 'Present', '2025-03-16 10:03:36'),
(133, 1020, 5, '2025-03-17', 'Absent', '2025-03-16 10:03:36'),
(134, 1010, 4, '2025-03-17', 'Present', '2025-03-16 10:03:41'),
(135, 1011, 4, '2025-03-17', 'Absent', '2025-03-16 10:03:41'),
(136, 1012, 4, '2025-03-17', 'Absent', '2025-03-16 10:03:41'),
(137, 1013, 4, '2025-03-17', 'Absent', '2025-03-16 10:03:41'),
(138, 1014, 4, '2025-03-17', 'Present', '2025-03-16 10:03:41'),
(139, 1015, 4, '2025-03-17', 'Present', '2025-03-16 10:03:41'),
(140, 1018, 4, '2025-03-17', 'Present', '2025-03-16 10:03:41'),
(141, 1020, 4, '2025-03-17', 'Absent', '2025-03-16 10:03:41'),
(142, 1010, 3, '2025-03-17', 'Present', '2025-03-16 10:03:45'),
(143, 1011, 3, '2025-03-17', 'Absent', '2025-03-16 10:03:45'),
(144, 1012, 3, '2025-03-17', 'Absent', '2025-03-16 10:03:45'),
(145, 1013, 3, '2025-03-17', 'Absent', '2025-03-16 10:03:45'),
(146, 1014, 3, '2025-03-17', 'Present', '2025-03-16 10:03:45'),
(147, 1015, 3, '2025-03-17', 'Present', '2025-03-16 10:03:45'),
(148, 1018, 3, '2025-03-17', 'Present', '2025-03-16 10:03:45'),
(149, 1020, 3, '2025-03-17', 'Absent', '2025-03-16 10:03:45'),
(150, 1010, 1, '2025-03-17', 'Present', '2025-03-16 10:03:49'),
(151, 1011, 1, '2025-03-17', 'Absent', '2025-03-16 10:03:49'),
(152, 1012, 1, '2025-03-17', 'Absent', '2025-03-16 10:03:49'),
(153, 1013, 1, '2025-03-17', 'Absent', '2025-03-16 10:03:49'),
(154, 1014, 1, '2025-03-17', 'Present', '2025-03-16 10:03:49'),
(155, 1015, 1, '2025-03-17', 'Present', '2025-03-16 10:03:49'),
(156, 1018, 1, '2025-03-17', 'Present', '2025-03-16 10:03:49'),
(157, 1020, 1, '2025-03-17', 'Absent', '2025-03-16 10:03:49'),
(158, 1010, 1, '2025-03-18', 'Present', '2025-03-16 10:05:14'),
(159, 1011, 1, '2025-03-18', 'Present', '2025-03-16 10:05:14'),
(160, 1012, 1, '2025-03-18', 'Absent', '2025-03-16 10:05:14'),
(161, 1013, 1, '2025-03-18', 'Present', '2025-03-16 10:05:14'),
(162, 1014, 1, '2025-03-18', 'Absent', '2025-03-16 10:05:14'),
(163, 1015, 1, '2025-03-18', 'Present', '2025-03-16 10:05:14'),
(164, 1018, 1, '2025-03-18', 'Absent', '2025-03-16 10:05:14'),
(165, 1020, 1, '2025-03-18', 'Absent', '2025-03-16 10:05:14'),
(166, 1010, 3, '2025-03-18', 'Present', '2025-03-16 10:05:19'),
(167, 1011, 3, '2025-03-18', 'Present', '2025-03-16 10:05:19'),
(168, 1012, 3, '2025-03-18', 'Absent', '2025-03-16 10:05:19'),
(169, 1013, 3, '2025-03-18', 'Present', '2025-03-16 10:05:19'),
(170, 1014, 3, '2025-03-18', 'Absent', '2025-03-16 10:05:19'),
(171, 1015, 3, '2025-03-18', 'Present', '2025-03-16 10:05:19'),
(172, 1018, 3, '2025-03-18', 'Absent', '2025-03-16 10:05:19'),
(173, 1020, 3, '2025-03-18', 'Absent', '2025-03-16 10:05:19'),
(174, 1010, 4, '2025-03-18', 'Present', '2025-03-16 10:05:23'),
(175, 1011, 4, '2025-03-18', 'Present', '2025-03-16 10:05:23'),
(176, 1012, 4, '2025-03-18', 'Absent', '2025-03-16 10:05:23'),
(177, 1013, 4, '2025-03-18', 'Present', '2025-03-16 10:05:23'),
(178, 1014, 4, '2025-03-18', 'Absent', '2025-03-16 10:05:23'),
(179, 1015, 4, '2025-03-18', 'Present', '2025-03-16 10:05:23'),
(180, 1018, 4, '2025-03-18', 'Absent', '2025-03-16 10:05:23'),
(181, 1020, 4, '2025-03-18', 'Absent', '2025-03-16 10:05:23'),
(182, 1010, 5, '2025-03-18', 'Present', '2025-03-16 10:05:27'),
(183, 1011, 5, '2025-03-18', 'Present', '2025-03-16 10:05:27'),
(184, 1012, 5, '2025-03-18', 'Absent', '2025-03-16 10:05:27'),
(185, 1013, 5, '2025-03-18', 'Present', '2025-03-16 10:05:27'),
(186, 1014, 5, '2025-03-18', 'Absent', '2025-03-16 10:05:27'),
(187, 1015, 5, '2025-03-18', 'Present', '2025-03-16 10:05:27'),
(188, 1018, 5, '2025-03-18', 'Absent', '2025-03-16 10:05:27'),
(189, 1020, 5, '2025-03-18', 'Absent', '2025-03-16 10:05:27'),
(190, 1010, 118, '2025-03-18', 'Present', '2025-03-16 10:05:31'),
(191, 1011, 118, '2025-03-18', 'Present', '2025-03-16 10:05:31'),
(192, 1012, 118, '2025-03-18', 'Absent', '2025-03-16 10:05:31'),
(193, 1013, 118, '2025-03-18', 'Present', '2025-03-16 10:05:31'),
(194, 1014, 118, '2025-03-18', 'Absent', '2025-03-16 10:05:31'),
(195, 1015, 118, '2025-03-18', 'Present', '2025-03-16 10:05:31'),
(196, 1018, 118, '2025-03-18', 'Absent', '2025-03-16 10:05:31'),
(197, 1020, 118, '2025-03-18', 'Absent', '2025-03-16 10:05:31'),
(199, 1010, 1, '2025-03-17', 'Present', '2025-03-16 19:04:56'),
(200, 1022, 1, '2025-03-17', 'Present', '2025-03-16 19:04:56'),
(201, 1010, 3, '2025-03-17', 'Present', '2025-03-16 19:05:01'),
(202, 1022, 3, '2025-03-17', 'Present', '2025-03-16 19:05:01'),
(203, 1010, 4, '2025-03-17', 'Present', '2025-03-16 19:05:05'),
(204, 1022, 4, '2025-03-17', 'Present', '2025-03-16 19:05:05'),
(205, 1010, 5, '2025-03-17', 'Present', '2025-03-16 19:05:09'),
(206, 1022, 5, '2025-03-17', 'Present', '2025-03-16 19:05:09'),
(207, 1010, 118, '2025-03-17', 'Present', '2025-03-16 19:05:12'),
(208, 1022, 118, '2025-03-17', 'Present', '2025-03-16 19:05:12'),
(209, 1022, 118, '2025-03-18', 'Absent', '2025-03-16 19:05:22'),
(210, 1022, 5, '2025-03-18', 'Absent', '2025-03-16 19:05:28'),
(211, 1022, 4, '2025-03-18', 'Absent', '2025-03-16 19:05:34'),
(212, 1022, 3, '2025-03-18', 'Absent', '2025-03-16 19:05:38'),
(213, 1022, 1, '2025-03-18', 'Absent', '2025-03-16 19:05:42'),
(214, 1021, 49, '2025-03-17', 'Present', '2025-03-16 19:15:24'),
(215, 1010, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(216, 1011, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(217, 1012, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(218, 1013, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(219, 1014, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(220, 1015, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(221, 1018, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(222, 1020, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47'),
(223, 1022, 1, '2025-04-30', 'Present', '2025-04-28 20:18:47');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `school_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `school_id`) VALUES
(1, 'Computer Science and Engineering', 1),
(2, 'Electrical Engineering', 1),
(3, 'Mechanical Engineering', 1),
(4, 'Civil Engineering', 1),
(5, 'Electronics & Communication Engineering', 1),
(6, 'Computer Applications', 1),
(7, 'Department of Bussiness Adminisration', 2),
(8, 'Department of Commerce', 2),
(9, 'Pharma', 3),
(10, 'Department of History', 4),
(11, 'Department of Psychology', 4),
(12, 'Department of Economics', 4),
(13, 'Department of Sociology & Social Work', 4),
(14, 'Department of Political Science', 4),
(15, 'Department of English & Foreign Languages', 4);

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `name`, `department_id`) VALUES
(1, 'B.Tech', 1),
(2, 'M.Tech', 1),
(3, 'PhD', 1),
(4, 'B.Tech', 2),
(5, 'M.Tech', 2),
(6, 'PhD', 2),
(7, 'B.Tech', 3),
(8, 'M.Tech', 3),
(9, 'PhD', 3),
(10, 'B.Tech', 4),
(11, 'M.Tech', 4),
(12, 'PhD', 4),
(13, 'B.Tech', 5),
(14, 'M.Tech', 5),
(15, 'PhD', 5),
(16, 'B.Tech', 6),
(17, 'M.Tech', 6),
(18, 'PhD', 6),
(19, 'BBA', 7),
(20, 'MBA', 7),
(21, 'BBA', 8),
(22, 'MBA', 8),
(23, 'B.Pharma', 9),
(24, 'M.Pharma', 9),
(25, 'PhD', 9),
(26, 'B.Pharma', 10),
(27, 'M.Pharma', 10),
(28, 'PhD', 10),
(29, 'B.Pharma', 11),
(30, 'M.Pharma', 11),
(31, 'PhD', 11),
(32, 'B.Pharma', 12),
(33, 'M.Pharma', 12),
(34, 'PhD', 12),
(35, 'B.Pharma', 13),
(36, 'M.Pharma', 13),
(37, 'PhD', 13),
(38, 'B.Pharma', 14),
(39, 'M.Pharma', 14),
(40, 'PhD', 14),
(41, 'B.Pharma', 15),
(42, 'M.Pharma', 15),
(43, 'PhD', 15);

-- --------------------------------------------------------

--
-- Table structure for table `saved_timetables`
--

CREATE TABLE `saved_timetables` (
  `id` int(11) NOT NULL,
  `session` varchar(50) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `program_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `saved_timetables`
--

INSERT INTO `saved_timetables` (`id`, `session`, `school_id`, `department_id`, `program_id`, `semester_id`, `created_at`) VALUES
(45, 'Aug-Dec', 1, 1, 1, 3, '2025-01-23 12:32:50'),
(46, 'Aug-Dec', 1, 1, 1, 1, '2025-01-23 12:33:56'),
(47, 'Aug-Dec', 1, 1, 1, 3, '2025-02-20 18:09:46'),
(48, 'Aug-Dec', 1, 1, 1, 4, '2025-02-21 16:47:01'),
(49, 'Aug-Dec', 1, 1, 1, 4, '2025-02-21 16:47:05'),
(50, 'Aug-Dec', 1, 1, 1, 4, '2025-02-21 16:47:08'),
(51, 'Aug-Dec', 1, 1, 1, 4, '2025-02-21 16:53:12'),
(52, 'Aug-Dec', 1, 1, 1, 3, '2025-02-21 17:21:52'),
(53, 'Aug-Dec', 1, 1, 1, 3, '2025-02-21 17:21:54'),
(54, 'Aug-Dec', 1, 1, 1, 3, '2025-02-21 17:22:11'),
(55, 'Aug-Dec', 1, 1, 1, 1, '2025-02-21 17:27:36'),
(56, 'Aug-Dec', 1, 1, 1, 1, '2025-02-23 09:27:15'),
(57, 'Aug-Dec', 1, 1, 1, 1, '2025-02-23 11:13:17'),
(58, 'Aug-Dec', 1, 1, 1, 3, '2025-02-27 06:04:53'),
(59, 'Aug-Dec', 1, 1, 1, 2, '2025-02-27 20:44:54'),
(60, 'Aug-Dec', 1, 1, 1, 1, '2025-02-27 20:59:50');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `name`) VALUES
(1, 'School of Engineering and Technology'),
(2, 'School of Management and Commerce'),
(3, 'School of Pharmaceutical Science'),
(4, 'School of Humanities & Social Science');

-- --------------------------------------------------------

--
-- Table structure for table `semesters`
--

CREATE TABLE `semesters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `program_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semesters`
--

INSERT INTO `semesters` (`id`, `name`, `program_id`) VALUES
(1, '1st Semester', 1),
(2, '2nd Semester', 1),
(3, '3rd Semester', 1),
(4, '4th Semester', 1),
(5, '5th Semester', 1),
(6, '6th Semester', 1),
(7, '7th Semester', 1),
(8, '8th Semester', 1),
(9, '1st Semester', 2),
(10, '2nd Semester', 2),
(11, '1st Semester', 3),
(12, '1st Semester', 4),
(13, '2nd Semester', 4),
(14, '3rd Semester', 4),
(15, '1st Semester', 5),
(16, '2nd Semester', 5),
(17, '1st Semester', 6),
(18, '1st Semester', 7),
(19, '2nd Semester', 7),
(20, '3rd Semester', 7),
(21, '1st Semester', 8),
(22, '2nd Semester', 8),
(23, '1st Semester', 9),
(24, '1st Semester', 10),
(25, '2nd Semester', 10),
(26, '1st Semester', 11),
(27, '1st Semester', 12),
(28, '2nd Semester', 12),
(29, '1st Semester', 13),
(30, '2nd Semester', 13),
(31, '1st Semester', 14),
(32, '2nd Semester', 14);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `program_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `program_id`, `semester_id`, `registration_number`, `password`) VALUES
(1010, 'suraj', 1, 1, '210310007054', 'student'),
(1011, 'rajat', 1, 1, '210310007044', NULL),
(1012, 'sudeep', 1, 1, '210310007053', NULL),
(1013, 'Priyangshu Kalita', 1, 1, '210310007039', NULL),
(1014, 'Pratim Das', 1, 1, '210310007024', NULL),
(1015, 'Anupama', 1, 1, '210310007004', NULL),
(1017, 'Pranab', 1, 2, '210310007036', NULL),
(1018, 'fahim', 1, 1, '210310007011', NULL),
(1020, 'Kaushik', 1, 1, '210310007013', NULL),
(1021, 'Suaurav', 1, 8, '210310007025', '$2b$10$bpm43cbm82k0E4KGNYTdcewMJd/O8BRZ0a3N869h1qwIbzJlOP6qe'),
(1022, 'Allen', 1, 1, '210310007001', '$2b$10$fj9tRZ2yosVm6wjQhgRV1upQN9u7JskmYjUrVz/FXNZgEptHt1tea');

-- --------------------------------------------------------

--
-- Table structure for table `student_assignments`
--

CREATE TABLE `student_assignments` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `status` enum('Submitted','Graded') DEFAULT 'Submitted',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_assignments`
--

INSERT INTO `student_assignments` (`id`, `assignment_id`, `student_id`, `file_path`, `status`, `submitted_at`) VALUES
(1, 1, 1010, '1734477235282-miniporject (2).sql', 'Submitted', '2025-02-26 20:00:05'),
(2, 1, 1010, '1734479981983-miniporject.sql', 'Submitted', '2025-02-26 20:00:05'),
(3, 1, 1010, '1734481995615-miniporject.sql', 'Submitted', '2025-02-26 20:00:05'),
(4, 3, 1010, '1734505197528-miniporject.sql', 'Submitted', '2025-02-26 20:00:05'),
(5, 4, 1010, '1734507766289-Timetable (1).xlsx', 'Submitted', '2025-02-26 20:00:05'),
(6, 5, 1012, '1734640766598-App.js', 'Submitted', '2025-02-26 20:00:05'),
(7, 1, 1010, 'data:image/webp;base64,UklGRoAQAABXRUJQVlA4IHQQAACwVgCdASoNAZsAPqVKnksmJCKsqjTLOZAUiWMHBqQJSLDHl1X3woiOoeO4282bZY2ieqsYs5Ps2duuIZhReM8OtOpPD+ER4pms3Wq/WFeppFM8thT5QmQRvwWY2fddtoFAFDjLRavdtlbFH/EQi8xk0kwTeI435q76KQhCtnKrub8V6DW/BgrpTtYeB3xsfWyv86+ccHJ9wiu3', 'Submitted', '2025-02-26 20:00:05'),
(8, 1, 1010, '1740302930620-timetable.png', 'Submitted', '2025-02-26 20:00:05'),
(9, 6, 1010, '1740320060367-Suraj Ali(Resume).pdf', 'Submitted', '2025-02-26 20:00:05'),
(10, 7, 1010, '1740601268433-miniporject (1).sql', 'Submitted', '2025-02-26 20:21:08'),
(11, 1, 1010, '1744781978468-vidiq_thumbnail_3.png', 'Submitted', '2025-04-16 05:39:38');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `total_classes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `semester_id`, `total_classes`) VALUES
(1, 'Physics-101', 1, 15),
(3, 'Engineering Graphics and Design', 1, 13),
(4, 'Engineering Mechanics', 1, 13),
(5, 'Sociology', 1, 10),
(6, 'Chemistry-201', 2, 12),
(7, 'Mathematics-II', 2, 15),
(8, 'PSPC', 2, 11),
(9, 'BEE', 2, 9),
(10, 'CPS', 2, 8),
(11, 'Workshop', 2, 6),
(12, 'Chemistry Lab', 2, 6),
(13, 'BEE Lab', 2, 6),
(14, 'Mathematics-III', 3, 0),
(15, 'Object Oriented Programming', 3, 0),
(16, 'Digital System', 3, 0),
(17, 'Data Structure and Algorithm', 3, 0),
(18, 'Constitution of India', 3, 0),
(19, 'OOP Lab', 3, 0),
(20, 'DSA Lab', 3, 0),
(21, 'Discrete Mathematics', 4, 0),
(22, 'COA', 4, 0),
(23, 'OS', 4, 0),
(24, 'JAVA Programming', 4, 0),
(25, 'Graph Theory', 4, 0),
(26, 'EVS', 4, 0),
(27, 'OS Lab', 4, 0),
(28, 'IT Lab', 4, 0),
(29, 'DBMS', 5, 0),
(30, 'DAA', 5, 0),
(31, 'FLAT', 5, 0),
(32, 'Program Elective-1', 5, 0),
(33, 'Engineering Economics', 5, 0),
(34, 'DBMS Lab', 5, 0),
(35, 'Web Programming Lab', 5, 0),
(36, 'Compiler Design', 6, 0),
(37, 'Computer Networks', 6, 0),
(38, 'Program Elective-2', 6, 0),
(39, 'Program Elective-3', 6, 0),
(40, 'Open Elective-1', 6, 0),
(41, 'Accountancy', 6, 0),
(42, 'Compiler Design Lab', 6, 0),
(43, 'Computer Networks Lab', 6, 0),
(44, 'Program Elective 4', 7, 0),
(45, 'Open Elective 2', 7, 0),
(46, 'Open Elective 3', 7, 0),
(47, 'Principle of Management', 7, 0),
(48, 'Project-1', 7, 0),
(49, 'Program Elective-5', 8, 0),
(50, 'Program Elective-6', 8, 0),
(51, 'Open Elective-4', 8, 0),
(52, 'Open Elective-5', 8, 0),
(53, 'Project-2', 8, 0),
(54, 'Advanced Algorithms', 9, 0),
(55, 'Advanced Operating Systems', 9, 0),
(56, 'Machine Learning', 9, 0),
(57, 'Data Mining', 9, 0),
(58, 'Research Methodology', 9, 0),
(59, 'Lab 1', 9, 0),
(60, 'Lab 2', 9, 0),
(61, 'Network Security', 10, 0),
(62, 'Distributed Systems', 10, 0),
(63, 'Cloud Computing', 10, 0),
(64, 'Big Data Analytics', 10, 0),
(65, 'Seminar', 10, 0),
(66, 'Lab 1', 10, 0),
(67, 'Lab 2', 10, 0),
(68, 'Mathematics 1', 11, 0),
(69, 'Physics', 11, 0),
(70, 'Circuit Theory', 11, 0),
(71, 'Electromagnetics', 11, 0),
(72, 'Electronics', 11, 0),
(73, 'Lab 1', 11, 0),
(74, 'Lab 2', 11, 0),
(75, 'Mathematics 2', 12, 0),
(76, 'Signals and Systems', 12, 0),
(77, 'Digital Logic', 12, 0),
(78, 'Microprocessors', 12, 0),
(79, 'Electrical Machines', 12, 0),
(80, 'Lab 1', 12, 0),
(81, 'Lab 2', 12, 0),
(82, 'Mathematics 1', 13, 0),
(83, 'Physics', 13, 0),
(84, 'Engineering Mechanics', 13, 0),
(85, 'Thermodynamics', 13, 0),
(86, 'Manufacturing Processes', 13, 0),
(87, 'Lab 1', 13, 0),
(88, 'Lab 2', 13, 0),
(89, 'Principles of Management', 14, 0),
(90, 'Microeconomics', 14, 0),
(91, 'Financial Accounting', 14, 0),
(92, 'Marketing Fundamentals', 14, 0),
(93, 'Business Communication', 14, 0),
(94, 'Lab 1', 14, 0),
(95, 'Lab 2', 14, 0),
(96, 'Macroeconomics', 15, 0),
(97, 'Business Law', 15, 0),
(98, 'Consumer Behavior', 15, 0),
(99, 'Marketing Research', 15, 0),
(100, 'Statistics for Business', 15, 0),
(101, 'Lab 1', 15, 0),
(102, 'Lab 2', 15, 0),
(103, 'Principles of Management', 16, 0),
(104, 'Microeconomics', 16, 0),
(105, 'Financial Accounting', 16, 0),
(106, 'Finance Fundamentals', 16, 0),
(107, 'Business Communication', 16, 0),
(108, 'Lab 1', 16, 0),
(109, 'Lab 2', 16, 0),
(110, 'Macroeconomics', 17, 0),
(111, 'Business Law', 17, 0),
(112, 'Corporate Finance', 17, 0),
(113, 'Investment Analysis', 17, 0),
(114, 'Statistics for Business', 17, 0),
(115, 'Lab 1', 17, 0),
(116, 'Lab 2', 17, 0),
(118, 'Mathematics', 1, 18);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `name`, `password`) VALUES
(1, 'Mr. Dipjyoti Deka', NULL),
(2, 'Ms. Manjula Kalita', NULL),
(3, 'Dr. Minakshi Gogoi', NULL),
(4, 'Ms. Mala Ahmed', NULL),
(5, 'Mr. Adarsh Pradhan', NULL),
(6, 'Ms. Shrabani Medhi', NULL),
(7, 'Ms. Ritushree Dutta', NULL),
(8, 'Dr. Th. Shanta Kumar', NULL),
(9, 'Mrs. Mridusmita Baruah', NULL),
(10, 'Mrs. Rubi Kalita', NULL),
(11, 'Ms. Ilina Sinha', NULL),
(12, 'New teacher', '$2b$10$s.OpHYZ4twz9bVxQ6Du39ec41fIHzGoMV6qWJu/bDaW/HFuxJ7fF2');

-- --------------------------------------------------------

--
-- Table structure for table `timetables`
--

CREATE TABLE `timetables` (
  `id` int(11) NOT NULL,
  `school_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `semester_id` int(11) NOT NULL,
  `session` varchar(50) NOT NULL,
  `timetable` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timetable_entries`
--

CREATE TABLE `timetable_entries` (
  `id` int(11) NOT NULL,
  `timetable_id` int(11) DEFAULT NULL,
  `day` varchar(20) DEFAULT NULL,
  `time_slot` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `teacher` varchar(255) DEFAULT NULL,
  `semester_number` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timetable_entries`
--

INSERT INTO `timetable_entries` (`id`, `timetable_id`, `day`, `time_slot`, `subject`, `teacher`, `semester_number`) VALUES
(1981, 56, 'Monday', '8:45-9:45', 'Engineering Graphics and Design', 'Mr. Dipjyoti Deka', '1'),
(1982, 56, 'Monday', '9:45-10:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(1983, 56, 'Monday', '10:45-11:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(1984, 56, 'Monday', '12:00-1:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(1985, 56, 'Monday', '1:45-2:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(1986, 56, 'Monday', '2:45-3:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(1987, 56, 'Tuesday', '8:45-9:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(1988, 56, 'Tuesday', '9:45-10:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(1989, 56, 'Tuesday', '10:45-11:45', 'Physics-101', 'Ms. Manjula Kalita', '1'),
(1990, 56, 'Tuesday', '12:00-1:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(1991, 56, 'Tuesday', '1:45-2:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(1992, 56, 'Tuesday', '2:45-3:45', 'Physics-101', 'Ms. Manjula Kalita', '1'),
(1993, 56, 'Wednesday', '8:45-9:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(1994, 56, 'Wednesday', '9:45-10:45', 'Physics-101', 'Ms. Manjula Kalita', '1'),
(1995, 56, 'Wednesday', '10:45-11:45', 'Engineering Graphics and Design', 'Mr. Dipjyoti Deka', '1'),
(1996, 56, 'Wednesday', '12:00-1:45', 'Engineering Graphics and Design', 'Mr. Dipjyoti Deka', '1'),
(1997, 56, 'Wednesday', '1:45-2:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(1998, 56, 'Wednesday', '2:45-3:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(1999, 56, 'Thursday', '8:45-9:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2000, 56, 'Thursday', '9:45-10:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(2001, 56, 'Thursday', '10:45-11:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2002, 56, 'Thursday', '12:00-1:45', 'Engineering Graphics and Design', 'Mr. Dipjyoti Deka', '1'),
(2003, 56, 'Thursday', '1:45-2:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(2004, 56, 'Thursday', '2:45-3:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(2005, 56, 'Friday', '8:45-9:45', 'Physics-101', 'Ms. Manjula Kalita', '1'),
(2006, 56, 'Friday', '9:45-10:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(2007, 56, 'Friday', '10:45-11:45', 'Engineering Mechanics', 'Dr. Th. Shanta Kumar', '1'),
(2008, 56, 'Friday', '12:00-1:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(2009, 56, 'Friday', '1:45-2:45', 'Physics-101', 'Ms. Manjula Kalita', '1'),
(2010, 56, 'Friday', '2:45-3:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(2011, 56, 'Saturday', '8:45-9:45', 'Sociology', 'Ms. Ilina Sinha', '1'),
(2012, 56, 'Saturday', '9:45-10:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2013, 56, 'Saturday', '10:45-11:45', 'Physics-101', 'Ms. Manjula Kalita', '1'),
(2014, 56, 'Saturday', '12:00-1:45', 'Physics-101', 'Ms. Manjula Kalita', '1'),
(2015, 56, 'Saturday', '1:45-2:45', 'Engineering Graphics and Design', 'Mr. Dipjyoti Deka', '1'),
(2016, 56, 'Saturday', '2:45-3:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2017, 57, 'Monday', '8:45-9:45', 'Engineering Mechanics', 'Ms. Shrabani Medhi', '1'),
(2018, 57, 'Monday', '9:45-10:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2019, 57, 'Monday', '10:45-11:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2020, 57, 'Monday', '12:00-1:45', 'Engineering Mechanics', 'Ms. Shrabani Medhi', '1'),
(2021, 57, 'Monday', '1:45-2:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2022, 57, 'Monday', '2:45-3:45', 'Engineering Mechanics', 'Ms. Shrabani Medhi', '1'),
(2023, 57, 'Tuesday', '8:45-9:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2024, 57, 'Tuesday', '9:45-10:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2025, 57, 'Tuesday', '10:45-11:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2026, 57, 'Tuesday', '12:00-1:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2027, 57, 'Tuesday', '1:45-2:45', 'Engineering Mechanics', 'Ms. Shrabani Medhi', '1'),
(2028, 57, 'Tuesday', '2:45-3:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2029, 57, 'Wednesday', '8:45-9:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2030, 57, 'Wednesday', '9:45-10:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2031, 57, 'Wednesday', '10:45-11:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2032, 57, 'Wednesday', '12:00-1:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2033, 57, 'Wednesday', '1:45-2:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2034, 57, 'Wednesday', '2:45-3:45', 'Engineering Mechanics', 'Ms. Shrabani Medhi', '1'),
(2035, 57, 'Thursday', '8:45-9:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2036, 57, 'Thursday', '9:45-10:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2037, 57, 'Thursday', '10:45-11:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2038, 57, 'Thursday', '12:00-1:45', 'Engineering Mechanics', 'Ms. Shrabani Medhi', '1'),
(2039, 57, 'Thursday', '1:45-2:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2040, 57, 'Thursday', '2:45-3:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2041, 57, 'Friday', '8:45-9:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2042, 57, 'Friday', '9:45-10:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2043, 57, 'Friday', '10:45-11:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2044, 57, 'Friday', '12:00-1:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2045, 57, 'Friday', '1:45-2:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2046, 57, 'Friday', '2:45-3:45', 'Engineering Mechanics', 'Ms. Shrabani Medhi', '1'),
(2047, 57, 'Saturday', '8:45-9:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2048, 57, 'Saturday', '9:45-10:45', 'Mathematics', 'Ms. Mala Ahmed', '1'),
(2049, 57, 'Saturday', '10:45-11:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2050, 57, 'Saturday', '12:00-1:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2051, 57, 'Saturday', '1:45-2:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2052, 57, 'Saturday', '2:45-3:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2053, 58, 'Monday', '8:45-9:45', 'DSA Lab', 'Dr. Minakshi Gogoi', '3'),
(2054, 58, 'Monday', '9:45-10:45', 'DSA Lab', 'Dr. Minakshi Gogoi', '3'),
(2055, 58, 'Monday', '10:45-11:45', 'Mathematics-III', 'Mr. Dipjyoti Deka', '3'),
(2056, 58, 'Monday', '12:00-1:45', 'Digital System', 'Mrs. Rubi Kalita', '3'),
(2057, 58, 'Monday', '1:45-2:45', 'Object Oriented Programming', 'Ms. Mala Ahmed', '3'),
(2058, 58, 'Monday', '2:45-3:45', 'Data Structure and Algorithm', 'Ms. Manjula Kalita', '3'),
(2059, 58, 'Tuesday', '8:45-9:45', 'DSA Lab', 'Dr. Minakshi Gogoi', '3'),
(2060, 58, 'Tuesday', '9:45-10:45', 'DSA Lab', 'Dr. Minakshi Gogoi', '3'),
(2061, 58, 'Tuesday', '10:45-11:45', 'Object Oriented Programming', 'Ms. Mala Ahmed', '3'),
(2062, 58, 'Tuesday', '12:00-1:45', 'Mathematics-III', 'Mr. Dipjyoti Deka', '3'),
(2063, 58, 'Tuesday', '1:45-2:45', 'Digital System', 'Mrs. Rubi Kalita', '3'),
(2064, 58, 'Tuesday', '2:45-3:45', 'Object Oriented Programming', 'Ms. Mala Ahmed', '3'),
(2065, 58, 'Wednesday', '8:45-9:45', 'OOP Lab', 'Ms. Ilina Sinha', '3'),
(2066, 58, 'Wednesday', '9:45-10:45', 'OOP Lab', 'Ms. Ilina Sinha', '3'),
(2067, 58, 'Wednesday', '10:45-11:45', 'Data Structure and Algorithm', 'Ms. Manjula Kalita', '3'),
(2068, 58, 'Wednesday', '12:00-1:45', 'Constitution of India', 'Ms. Shrabani Medhi', '3'),
(2069, 58, 'Wednesday', '1:45-2:45', 'Mathematics-III', 'Mr. Dipjyoti Deka', '3'),
(2070, 58, 'Wednesday', '2:45-3:45', 'Constitution of India', 'Ms. Shrabani Medhi', '3'),
(2071, 58, 'Thursday', '8:45-9:45', 'OOP Lab', 'Ms. Ilina Sinha', '3'),
(2072, 58, 'Thursday', '9:45-10:45', 'OOP Lab', 'Ms. Ilina Sinha', '3'),
(2073, 58, 'Thursday', '10:45-11:45', 'Constitution of India', 'Ms. Shrabani Medhi', '3'),
(2074, 58, 'Thursday', '12:00-1:45', 'Object Oriented Programming', 'Ms. Mala Ahmed', '3'),
(2075, 58, 'Thursday', '1:45-2:45', 'Data Structure and Algorithm', 'Ms. Manjula Kalita', '3'),
(2076, 58, 'Thursday', '2:45-3:45', 'Object Oriented Programming', 'Ms. Mala Ahmed', '3'),
(2077, 58, 'Friday', '8:45-9:45', 'Data Structure and Algorithm', 'Ms. Manjula Kalita', '3'),
(2078, 58, 'Friday', '9:45-10:45', 'Constitution of India', 'Ms. Shrabani Medhi', '3'),
(2079, 58, 'Friday', '10:45-11:45', 'Digital System', 'Mrs. Rubi Kalita', '3'),
(2080, 58, 'Friday', '12:00-1:45', 'Digital System', 'Mrs. Rubi Kalita', '3'),
(2081, 58, 'Friday', '1:45-2:45', 'Mathematics-III', 'Mr. Dipjyoti Deka', '3'),
(2082, 58, 'Friday', '2:45-3:45', 'Data Structure and Algorithm', 'Ms. Manjula Kalita', '3'),
(2083, 58, 'Saturday', '8:45-9:45', 'Mathematics-III', 'Mr. Dipjyoti Deka', '3'),
(2084, 58, 'Saturday', '9:45-10:45', 'Data Structure and Algorithm', 'Ms. Manjula Kalita', '3'),
(2085, 58, 'Saturday', '10:45-11:45', 'Object Oriented Programming', 'Ms. Mala Ahmed', '3'),
(2086, 58, 'Saturday', '12:00-1:45', 'Mathematics-III', 'Mr. Dipjyoti Deka', '3'),
(2087, 58, 'Saturday', '1:45-2:45', 'Digital System', 'Mrs. Rubi Kalita', '3'),
(2088, 58, 'Saturday', '2:45-3:45', 'Digital System', 'Mrs. Rubi Kalita', '3'),
(2089, 59, 'Monday', '8:45-9:45', 'Chemistry Lab', 'Dr. Minakshi Gogoi', '2'),
(2090, 59, 'Monday', '9:45-10:45', 'Chemistry Lab', 'Dr. Minakshi Gogoi', '2'),
(2091, 59, 'Monday', '10:45-11:45', 'BEE', 'Ms. Manjula Kalita', '2'),
(2092, 59, 'Monday', '12:00-1:45', 'BEE', 'Ms. Manjula Kalita', '2'),
(2093, 59, 'Monday', '1:45-2:45', 'Chemistry-201', 'Mr. Dipjyoti Deka', '2'),
(2094, 59, 'Monday', '2:45-3:45', 'CPS', 'Ms. Mala Ahmed', '2'),
(2095, 59, 'Tuesday', '8:45-9:45', 'Chemistry Lab', 'Dr. Minakshi Gogoi', '2'),
(2096, 59, 'Tuesday', '9:45-10:45', 'Chemistry Lab', 'Dr. Minakshi Gogoi', '2'),
(2097, 59, 'Tuesday', '10:45-11:45', 'PSPC', 'Dr. Th. Shanta Kumar', '2'),
(2098, 59, 'Tuesday', '12:00-1:45', 'PSPC', 'Dr. Th. Shanta Kumar', '2'),
(2099, 59, 'Tuesday', '1:45-2:45', 'CPS', 'Ms. Mala Ahmed', '2'),
(2100, 59, 'Tuesday', '2:45-3:45', 'PSPC', 'Dr. Th. Shanta Kumar', '2'),
(2101, 59, 'Wednesday', '8:45-9:45', 'BEE Lab', 'Mr. Adarsh Pradhan', '2'),
(2102, 59, 'Wednesday', '9:45-10:45', 'BEE Lab', 'Mr. Adarsh Pradhan', '2'),
(2103, 59, 'Wednesday', '10:45-11:45', 'Workshop', 'Ms. Shrabani Medhi', '2'),
(2104, 59, 'Wednesday', '12:00-1:45', 'Chemistry-201', 'Mr. Dipjyoti Deka', '2'),
(2105, 59, 'Wednesday', '1:45-2:45', 'Mathematics-II', 'Mrs. Rubi Kalita', '2'),
(2106, 59, 'Wednesday', '2:45-3:45', 'BEE', 'Ms. Manjula Kalita', '2'),
(2107, 59, 'Thursday', '8:45-9:45', 'BEE Lab', 'Mr. Adarsh Pradhan', '2'),
(2108, 59, 'Thursday', '9:45-10:45', 'BEE Lab', 'Mr. Adarsh Pradhan', '2'),
(2109, 59, 'Thursday', '10:45-11:45', 'CPS', 'Ms. Mala Ahmed', '2'),
(2110, 59, 'Thursday', '12:00-1:45', 'Mathematics-II', 'Mrs. Rubi Kalita', '2'),
(2111, 59, 'Thursday', '1:45-2:45', 'BEE', 'Ms. Manjula Kalita', '2'),
(2112, 59, 'Thursday', '2:45-3:45', 'Mathematics-II', 'Mrs. Rubi Kalita', '2'),
(2113, 59, 'Friday', '8:45-9:45', 'CPS', 'Ms. Mala Ahmed', '2'),
(2114, 59, 'Friday', '9:45-10:45', 'Chemistry-201', 'Mr. Dipjyoti Deka', '2'),
(2115, 59, 'Friday', '10:45-11:45', 'PSPC', 'Dr. Th. Shanta Kumar', '2'),
(2116, 59, 'Friday', '12:00-1:45', 'PSPC', 'Dr. Th. Shanta Kumar', '2'),
(2117, 59, 'Friday', '1:45-2:45', 'CPS', 'Ms. Mala Ahmed', '2'),
(2118, 59, 'Friday', '2:45-3:45', 'Workshop', 'Ms. Shrabani Medhi', '2'),
(2119, 59, 'Saturday', '8:45-9:45', 'BEE', 'Ms. Manjula Kalita', '2'),
(2120, 59, 'Saturday', '9:45-10:45', 'CPS', 'Ms. Mala Ahmed', '2'),
(2121, 59, 'Saturday', '10:45-11:45', 'Chemistry-201', 'Mr. Dipjyoti Deka', '2'),
(2122, 59, 'Saturday', '12:00-1:45', 'Mathematics-II', 'Mrs. Rubi Kalita', '2'),
(2123, 59, 'Saturday', '1:45-2:45', 'Chemistry-201', 'Mr. Dipjyoti Deka', '2'),
(2124, 59, 'Saturday', '2:45-3:45', 'Mathematics-II', 'Mrs. Rubi Kalita', '2'),
(2125, 60, 'Monday', '8:45-9:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2126, 60, 'Monday', '9:45-10:45', 'Engineering Mechanics', 'Ms. Ilina Sinha', '1'),
(2127, 60, 'Monday', '10:45-11:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2128, 60, 'Monday', '12:00-1:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2129, 60, 'Monday', '1:45-2:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2130, 60, 'Monday', '2:45-3:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2131, 60, 'Tuesday', '8:45-9:45', 'Engineering Mechanics', 'Ms. Ilina Sinha', '1'),
(2132, 60, 'Tuesday', '9:45-10:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2133, 60, 'Tuesday', '10:45-11:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2134, 60, 'Tuesday', '12:00-1:45', 'Engineering Mechanics', 'Ms. Ilina Sinha', '1'),
(2135, 60, 'Tuesday', '1:45-2:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2136, 60, 'Tuesday', '2:45-3:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2137, 60, 'Wednesday', '8:45-9:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2138, 60, 'Wednesday', '9:45-10:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2139, 60, 'Wednesday', '10:45-11:45', 'Engineering Mechanics', 'Ms. Ilina Sinha', '1'),
(2140, 60, 'Wednesday', '12:00-1:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2141, 60, 'Wednesday', '1:45-2:45', 'Engineering Mechanics', 'Ms. Ilina Sinha', '1'),
(2142, 60, 'Wednesday', '2:45-3:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2143, 60, 'Thursday', '8:45-9:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2144, 60, 'Thursday', '9:45-10:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2145, 60, 'Thursday', '10:45-11:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2146, 60, 'Thursday', '12:00-1:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2147, 60, 'Thursday', '1:45-2:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2148, 60, 'Thursday', '2:45-3:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2149, 60, 'Friday', '8:45-9:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2150, 60, 'Friday', '9:45-10:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2151, 60, 'Friday', '10:45-11:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1'),
(2152, 60, 'Friday', '12:00-1:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2153, 60, 'Friday', '1:45-2:45', 'Engineering Mechanics', 'Ms. Ilina Sinha', '1'),
(2154, 60, 'Friday', '2:45-3:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2155, 60, 'Saturday', '8:45-9:45', 'Engineering Mechanics', 'Ms. Ilina Sinha', '1'),
(2156, 60, 'Saturday', '9:45-10:45', 'Mathematics', 'Mrs. Mridusmita Baruah', '1'),
(2157, 60, 'Saturday', '10:45-11:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2158, 60, 'Saturday', '12:00-1:45', 'Sociology', 'Ms. Manjula Kalita', '1'),
(2159, 60, 'Saturday', '1:45-2:45', 'Physics-101', 'Mr. Dipjyoti Deka', '1'),
(2160, 60, 'Saturday', '2:45-3:45', 'Engineering Graphics and Design', 'Dr. Minakshi Gogoi', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `semester_id` (`semester_id`);

--
-- Indexes for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `saved_timetables`
--
ALTER TABLE `saved_timetables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `program_id` (`program_id`),
  ADD KEY `semester_id` (`semester_id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_number` (`registration_number`),
  ADD KEY `program_id` (`program_id`),
  ADD KEY `semester_id` (`semester_id`);

--
-- Indexes for table `student_assignments`
--
ALTER TABLE `student_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `semester_id` (`semester_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timetables`
--
ALTER TABLE `timetables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `program_id` (`program_id`),
  ADD KEY `semester_id` (`semester_id`);

--
-- Indexes for table `timetable_entries`
--
ALTER TABLE `timetable_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timetable_id` (`timetable_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `attendance_records`
--
ALTER TABLE `attendance_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `programs`
--
ALTER TABLE `programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `saved_timetables`
--
ALTER TABLE `saved_timetables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `schools`
--
ALTER TABLE `schools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `semesters`
--
ALTER TABLE `semesters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1023;

--
-- AUTO_INCREMENT for table `student_assignments`
--
ALTER TABLE `student_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `timetables`
--
ALTER TABLE `timetables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `timetable_entries`
--
ALTER TABLE `timetable_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2161;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`);

--
-- Constraints for table `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `attendance_records_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`);

--
-- Constraints for table `programs`
--
ALTER TABLE `programs`
  ADD CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `saved_timetables`
--
ALTER TABLE `saved_timetables`
  ADD CONSTRAINT `saved_timetables_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`),
  ADD CONSTRAINT `saved_timetables_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `saved_timetables_ibfk_3` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`),
  ADD CONSTRAINT `saved_timetables_ibfk_4` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`);

--
-- Constraints for table `semesters`
--
ALTER TABLE `semesters`
  ADD CONSTRAINT `semesters_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`),
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`);

--
-- Constraints for table `student_assignments`
--
ALTER TABLE `student_assignments`
  ADD CONSTRAINT `fk_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`),
  ADD CONSTRAINT `fk_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `student_assignments_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`),
  ADD CONSTRAINT `student_assignments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`);

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`);

--
-- Constraints for table `timetables`
--
ALTER TABLE `timetables`
  ADD CONSTRAINT `timetables_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`),
  ADD CONSTRAINT `timetables_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `timetables_ibfk_3` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`),
  ADD CONSTRAINT `timetables_ibfk_4` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`);

--
-- Constraints for table `timetable_entries`
--
ALTER TABLE `timetable_entries`
  ADD CONSTRAINT `timetable_entries_ibfk_1` FOREIGN KEY (`timetable_id`) REFERENCES `saved_timetables` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
