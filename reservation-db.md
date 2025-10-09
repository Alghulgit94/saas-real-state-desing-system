| column_name        | data_type                | character_maximum_length | is_nullable | column_default    |
| ------------------ | ------------------------ | ------------------------ | ----------- | ----------------- |
| id                 | uuid                     | null                     | NO          | gen_random_uuid() |
| created_at         | timestamp with time zone | null                     | YES         | now()             |
| first_name         | text                     | null                     | NO          | null              |
| last_name          | text                     | null                     | NO          | null              |
| email              | text                     | null                     | NO          | null              |
| phone              | text                     | null                     | YES         | null              |
| additional_message | text                     | null                     | YES         | null              |
| lot_id             | text                     | null                     | NO          | null              |
| lot_details        | jsonb                    | null                     | YES         | null              |
| reservation_date   | timestamp with time zone | null                     | NO          | null              |
| status             | text                     | null                     | YES         | 'pending'::text   |
| confirmed_at       | timestamp with time zone | null                     | YES         | null              |
| cancelled_at       | timestamp with time zone | null                     | YES         | null              |
| email_lower        | text                     | null                     | YES         | null              |