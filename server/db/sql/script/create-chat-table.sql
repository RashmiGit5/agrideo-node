
ALTER DATABASE agrideo_live CHARACTER SET = utf8mb4  COLLATE = utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `msg_type` varchar(64) DEFAULT 'text',
  `msg_text` text DEFAULT 'You are now connected on Agrideo.',
  `sender_id` int(11) DEFAULT NULL,
  `last_msg_at` timestamp NULL DEFAULT current_timestamp(),
  `blocked_uid` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;



CREATE TABLE IF NOT EXISTS `chat_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `chat_id` int(11) NOT NULL,
  `msg` text DEFAULT NULL,
  `attachment_url` varchar(256) DEFAULT NULL,
  `attachment_type` varchar(64) DEFAULT NULL,
  `sender_id` int(11) NOT NULL,
  `msg_status` tinyint(2) NOT NULL DEFAULT 1 COMMENT '1:sent, 2:received, 3:read, 4:blocked',
  `delete_status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '	0:none, 1:deleted for sender, 2:deleted for receiver, 3:deleted for all	',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;



CREATE TABLE IF NOT EXISTS `chat_user_status` (
  `user_id` int(11) NOT NULL PRIMARY KEY,
  `user_status` tinyint(2) NOT NULL DEFAULT 1 COMMENT '0:offline, 1: available, 2:busy, 3:away',
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;