-- Remove the `auth_user` table and other Django default tables
-- Table structure for `user_profile`
CREATE TABLE "user_profile" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "phone_number" varchar(20) NULL,
    "address" varchar(255) NULL,
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id")
);

-- Table structure for `category`
CREATE TABLE "category" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" varchar(100) NOT NULL,
    "description" text NULL
);

-- Table structure for `project`
CREATE TABLE "project" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" varchar(100) NOT NULL,
    "description" text NULL,
    "owner_id" integer NOT NULL,
    FOREIGN KEY("owner_id") REFERENCES "auth_user"("id")
);

-- Table structure for `todoapp_todoitem`
CREATE TABLE "todoapp_todoitem" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "category_id" integer NULL,
    "project_id" integer NULL,
    "title" varchar(100) NOT NULL,
    "description" text NOT NULL,
    "created_at" datetime NOT NULL,
    "due_date" datetime NULL,
    "priority" varchar(10) NULL,
    "completed" bool NOT NULL,
    "recurring_interval" varchar(50) NULL,
    "stage" varchar(50) NULL,  -- Added stage field
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id"),
    FOREIGN KEY("category_id") REFERENCES "category"("id"),
    FOREIGN KEY("project_id") REFERENCES "project"("id")
);

-- Table structure for `tag`
CREATE TABLE "tag" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" varchar(50) NOT NULL
);

-- Table structure for `todoitem_tags`
CREATE TABLE "todoitem_tags" (
    "todoitem_id" integer NOT NULL,
    "tag_id" integer NOT NULL,
    PRIMARY KEY ("todoitem_id", "tag_id"),
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id"),
    FOREIGN KEY("tag_id") REFERENCES "tag"("id")
);

-- Table structure for `attachment`
CREATE TABLE "attachment" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoitem_id" integer NOT NULL,
    "file_path" varchar(255) NOT NULL,
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id")
);

-- Table structure for `subtask`
CREATE TABLE "subtask" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoitem_id" integer NOT NULL,
    "title" varchar(100) NOT NULL,
    "description" text NOT NULL,
    "completed" bool NOT NULL,
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id")
);

-- Table structure for `notification`
CREATE TABLE "notification" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "message" text NOT NULL,
    "read" bool NOT NULL,
    "created_at" datetime NOT NULL,
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id")
);

-- Table structure for `comment`
CREATE TABLE "comment" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoitem_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "comment_text" text NOT NULL,
    "created_at" datetime NOT NULL,
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id"),
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id")
);

-- Table structure for `reminder`
CREATE TABLE "reminder" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoitem_id" integer NOT NULL,
    "reminder_time" datetime NOT NULL,
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id")
);

-- Table structure for `activity_log`
CREATE TABLE "activity_log" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoitem_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "activity" text NOT NULL,
    "timestamp" datetime NOT NULL,
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id"),
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id")
);

-- Table structure for `collaborator`
CREATE TABLE "collaborator" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoitem_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id"),
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id")
);

-- Table structure for `shared_list`
CREATE TABLE "shared_list" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "list_name" varchar(100) NOT NULL,
    "owner_id" integer NOT NULL,
    FOREIGN KEY("owner_id") REFERENCES "auth_user"("id")
);

-- Table structure for `shared_list_todoitems`
CREATE TABLE "shared_list_todoitems" (
    "shared_list_id" integer NOT NULL,
    "todoitem_id" integer NOT NULL,
    PRIMARY KEY ("shared_list_id", "todoitem_id"),
    FOREIGN KEY("shared_list_id") REFERENCES "shared_list"("id"),
    FOREIGN KEY("todoitem_id") REFERENCES "todoapp_todoitem"("id")
);

-- Table structure for `user_preference`
CREATE TABLE "user_preference" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "preference_key" varchar(100) NOT NULL,
    "preference_value" varchar(255) NOT NULL,
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id")
);

-- Table structure for `user_theme`
CREATE TABLE "user_theme" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" integer NOT NULL,
    "theme_name" varchar(100) NOT NULL,
    "primary_color" varchar(7) NOT NULL,
    "secondary_color" varchar(7) NOT NULL,
    FOREIGN KEY("user_id") REFERENCES "auth_user"("id")
);
