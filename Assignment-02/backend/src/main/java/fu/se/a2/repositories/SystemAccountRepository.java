package fu.se.a2.repositories;

import fu.se.a2.entities.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Integer> {

    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    boolean existsByAccountEmail(String accountEmail);

    boolean existsByAccountEmailAndAccountIDNot(String accountEmail, Integer accountID);

    @Query("SELECT a FROM SystemAccount a WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(a.accountName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.accountEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:role IS NULL OR a.accountRole = :role)")
    List<SystemAccount> searchAccounts(@Param("keyword") String keyword, @Param("role") Integer role);
}
