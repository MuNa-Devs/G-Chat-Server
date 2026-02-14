INSERT INTO friend_requests
    (sender_id, receiver_id)

SELECT $1, $2

WHERE (
    NOT EXISTS (
        INSERT INTO friends
            (user1, user2)
        
        SELECT LEAST($1, $2), GREATEST($1, $2)

        WHERE (
            EXISTS (
                SELECT fr.request_id
                FROM friend_requests fr

                WHERE (
                    fr.sender_id = $2
                    AND
                    fr.receiver_id = $1
                )
            )
            AND
            NOT EXISTS (
                SELECT f.id
                FROM friends f

                WHERE (
                    f.user1 = LEAST($1, $2)
                    AND
                    f.user2 = GREATEST($1, $2)
                )
            )
        )

        RETURNING friend_id
    )
    AND
    NOT EXISTS (
        SELECT request_id
        FROM friend_requests

        WHERE (
            sender_id = $1
            AND
            receiver_id = $2
        )
    )
)