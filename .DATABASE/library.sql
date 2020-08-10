/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP DATABASE IF EXISTS `library`;
CREATE DATABASE IF NOT EXISTS `library` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `library`;

DROP TABLE IF EXISTS `author`;
CREATE TABLE IF NOT EXISTS `author` (
  `author_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `forename` varchar(50) NOT NULL DEFAULT '0',
  `surname` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`author_id`),
  UNIQUE KEY `uq_author_forename_surname` (`forename`,`surname`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

DELETE FROM `author`;
/*!40000 ALTER TABLE `author` DISABLE KEYS */;
INSERT INTO `author` (`author_id`, `forename`, `surname`) VALUES
	(6, 'Aleksandar', 'Jevremović'),
	(9, 'Dejan', 'Živković'),
	(1, 'Dobrica', 'Ćosić'),
	(7, 'Milan', 'Tair'),
	(5, 'Mladen ', 'Veinović'),
	(3, 'Momo', 'Kapor'),
	(8, 'Sigmund', 'Frojd'),
	(4, 'Tahere', 'Mafi'),
	(2, 'Vuk', 'Drašković');
/*!40000 ALTER TABLE `author` ENABLE KEYS */;

DROP TABLE IF EXISTS `book`;
CREATE TABLE IF NOT EXISTS `book` (
  `book_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL DEFAULT '0',
  `original_title` varchar(64) NOT NULL DEFAULT '0',
  `publication_year` smallint(4) unsigned NOT NULL DEFAULT '0',
  `pages` smallint(4) unsigned NOT NULL DEFAULT '0',
  `isbn` varchar(13) NOT NULL DEFAULT '0',
  `language` varchar(30) NOT NULL DEFAULT '0',
  `catalog_number` varchar(10) NOT NULL DEFAULT '0',
  `is_visible` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `category_id` int(10) unsigned NOT NULL DEFAULT '0',
  `publisher_id` int(10) unsigned NOT NULL DEFAULT '0',
  `location_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `uk_book_isbn` (`isbn`),
  UNIQUE KEY `uq_book_catalog_number` (`catalog_number`),
  KEY `fk_book_category_id` (`category_id`),
  KEY `fk_book_publisher_id` (`publisher_id`),
  KEY `fk_book_location_id` (`location_id`),
  CONSTRAINT `fk_book_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_book_location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_book_publisher_id` FOREIGN KEY (`publisher_id`) REFERENCES `publisher` (`publisher_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

DELETE FROM `book`;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` (`book_id`, `title`, `original_title`, `publication_year`, `pages`, `isbn`, `language`, `catalog_number`, `is_visible`, `category_id`, `publisher_id`, `location_id`) VALUES
	(1, 'Kompletan uvod u psihoanalizu', 'Vorlesungen zur Einführung in die Psychoanalyse', 2006, 523, '2500001201142', 'srpski', '1', 1, 6, 2, 4),
	(5, 'Baze podataka', 'Baze podataka', 2016, 186, '250000425111', 'srpski', '2', 1, 8, 3, 1),
	(6, 'Ugrizi me', 'Bite me', 2003, 231, '2144121854711', 'srpski', '3', 1, 9, 1, 1),
	(7, 'Računarske mreže', 'Računarske mreže', 2016, 145, '2008978945612', 'srpski', '2068', 1, 8, 3, 3),
	(8, 'Osnove programiranja', 'Osnove programiranja', 2014, 245, '2008978112612', 'srpski', '2020171120', 1, 8, 3, 3);
/*!40000 ALTER TABLE `book` ENABLE KEYS */;

DROP TABLE IF EXISTS `book_author`;
CREATE TABLE IF NOT EXISTS `book_author` (
  `book_author_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `book_id` int(10) unsigned NOT NULL DEFAULT '0',
  `author_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`book_author_id`),
  UNIQUE KEY `uq_book_author_book_id_author_id` (`book_id`,`author_id`),
  KEY `fk_book_author_author_id` (`author_id`),
  CONSTRAINT `fk_book_author_author_id` FOREIGN KEY (`author_id`) REFERENCES `author` (`author_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_book_author_book_id` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

DELETE FROM `book_author`;
/*!40000 ALTER TABLE `book_author` DISABLE KEYS */;
INSERT INTO `book_author` (`book_author_id`, `book_id`, `author_id`) VALUES
	(1, 1, 8),
	(3, 5, 5),
	(2, 5, 6),
	(4, 5, 7),
	(5, 6, 4),
	(7, 7, 5),
	(6, 7, 6),
	(8, 8, 9);
/*!40000 ALTER TABLE `book_author` ENABLE KEYS */;

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`) VALUES
	(1, 'Dečija književnost'),
	(9, 'Fantastika'),
	(2, 'Filozofija'),
	(8, 'Informatika'),
	(3, 'Istorija'),
	(4, 'Medicina'),
	(5, 'Politika'),
	(6, 'Psihologija'),
	(7, 'Rečnik');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

DROP TABLE IF EXISTS `location`;
CREATE TABLE IF NOT EXISTS `location` (
  `location_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `room` varchar(30) NOT NULL DEFAULT '0',
  `shelf` varchar(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `uq_location_room_shelf` (`room`,`shelf`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

DELETE FROM `location`;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` (`location_id`, `room`, `shelf`) VALUES
	(6, 'Dečija soba', 'DČ01'),
	(1, 'Dnevna soba', 'DS01'),
	(3, 'Dnevna soba', 'DS02'),
	(4, 'Kancelarija', 'KC01'),
	(5, 'Kancelarija', 'KC02');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `book_id` int(10) unsigned NOT NULL DEFAULT '0',
  `cover` enum('front','back') NOT NULL DEFAULT 'front',
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_book_id_cover` (`book_id`,`cover`),
  UNIQUE KEY `uq_image_path` (`image_path`),
  CONSTRAINT `fk_photo_book_id` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `photo`;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

DROP TABLE IF EXISTS `publisher`;
CREATE TABLE IF NOT EXISTS `publisher` (
  `publisher_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `city` varchar(50) NOT NULL DEFAULT '0',
  `state` varchar(64) NOT NULL DEFAULT '0',
  `founded_in` smallint(4) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`publisher_id`),
  UNIQUE KEY `uq_publisher_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

DELETE FROM `publisher`;
/*!40000 ALTER TABLE `publisher` DISABLE KEYS */;
INSERT INTO `publisher` (`publisher_id`, `name`, `city`, `state`, `founded_in`) VALUES
	(1, 'Laguna', 'Beograd', 'Srbija', 1999),
	(2, 'Klett', 'Berlin', 'Nemačka', 1956),
	(3, 'Univerzitet Singidunum', 'Beograd', 'Srbija', 2003),
	(4, 'Harvard University Press', 'Cambridge, MA', 'SAD', 1977);
/*!40000 ALTER TABLE `publisher` ENABLE KEYS */;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '0',
  `password_hash` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `username`, `password_hash`) VALUES
	(1, 'alisa', '5A89D4BB1073097D3B1A4934DF33E434B92ADA515DE9A5410762C03498E93447C996DD3085E95ED0521BB5C8133CC8BFCDCFBD8E07C1D811F8C5C1175B4529CA'),
	(2, 'nimiko', 'kjhfku29z92babnmyeg82738gkjjbuz9238'),
	(3, 'matilda', '2DCBB586BCD2D3BA8A3AA4A52FBEB34D53FEE06B7507269B4662108720AC3146D44576573329C769109373A4288DACBFF064568423EAC4E9FBC54DF07A88EE2E');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
