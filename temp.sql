INSERT INTO room_members rm

SELECT $1, $2
FROM rooms r

LEFT JOIN room_members rm
ON
    r.r_id = rm.r_id

WHERE (
    r.join_pref = 'Anyone Can Join'
    AND
    r.r_id = $1
)

GROUP BY r.r_id, r.r_size

HAVING COUNT(rm.user_id) < r.r_size;