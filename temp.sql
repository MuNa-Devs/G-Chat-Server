SELECT
    u.id,
    u.username,
    u.pfp,
    (f.friend_id is NOT NULL) AS is_friend

FROM users u

LEFT JOIN friends f
ON (
    (f.user1 = u.id AND f.user2 = $2)
    OR
    (f.user1 = %2 AND f.user2 = u.id)
)

WHERE
    username ILIKE $1
    AND
    NOT id = $2

LIMIT 15

ORDER BY username ASC;

-- OR

SELECT
    u.id,
    u.username,
    u.pfp,
    EXISTS (
        SELECT
            f.friend_id
        FROM friends f

        WHERE (
            f.user1 = LEAST($2, u.id)
            AND
            f.user2 = GREATEST($2, u.id)
        )
    )
FROM users u

WHERE
    username ILIKE $1
    AND
    NOT id = $2

LIMIT 15

ORDER BY username ASC;