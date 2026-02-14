BEGIN

-- Check if frnd req already exists in reverse order
-- If yes, Insert into friends and delete in friend_requests else, continue
WITH request_id AS (
    DELETE FROM friend_requests fr
    
    WHERE (
        sender_id = $2
        AND
        receiver_id = $1
    )

    RETURNING request_id
)

INSERT INTO friends
    (user1, user2)

SELECT LEAST($1, $2), GREATEST($1, $2)

WHERE (
    EXISTS (SELECT request_id FROM request_id)
    AND
    NOT EXISTS (
        SELECT f.friend_id
        FROM friends f

        WHERE (
            user1 = LEAST($1, $2)
            AND
            user2 = GREATEST($1, $2)
        )
    )
)

RETURNING friend_id

-- If insert into friends is done, we don't insert into the friend_requests
-- That condition is checked inside the code. If the insert into friends is not done,
-- that means,
--  there are no redundant frnd reqs,
--  they don't exist in friends table.
-- Now, we just check if they don't exist in same order and insert.

INSERT INTO friend_requests

SELECT $1, $2

WHERE NOT EXISTS (
    SELECT fr.request_id
    FROM friend_requests fr

    WHERE (
        fr.sender_id = $1
        AND
        fr.receiver_id = $2
    )
)

RETURNING request_id

COMMIT