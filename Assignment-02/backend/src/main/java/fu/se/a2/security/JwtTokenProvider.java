package fu.se.a2.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long jwtExpirationMs;

    public JwtTokenProvider(@Value("${app.jwt.secret}") String jwtSecret,
                            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationMs) {
        this.jwtExpirationMs = jwtExpirationMs;

        SecretKey tempKey;
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            tempKey = Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            if (keyBytes.length < 32) {
                // Pad if needed for 256 bits
                byte[] padded = new byte[32];
                System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
                tempKey = Keys.hmacShaKeyFor(padded);
            } else {
                tempKey = Keys.hmacShaKeyFor(keyBytes);
            }
        }
        this.key = tempKey;
    }

    public String generateToken(CustomUserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("accountId", userDetails.getAccountID())
                .claim("accountName", userDetails.getAccountName())
                .claim("accountRole", userDetails.getAccountRole())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Integer getAccountIdFromToken(String token) {
        return getClaims(token).get("accountId", Integer.class);
    }

    public Integer getAccountRoleFromToken(String token) {
        return getClaims(token).get("accountRole", Integer.class);
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
