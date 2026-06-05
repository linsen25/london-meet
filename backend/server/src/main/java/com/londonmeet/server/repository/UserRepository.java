package com.londonmeet.server.repository;

import com.londonmeet.pojo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 用户数据访问接口
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据 openid 查询用户
     */
    Optional<User> findByOpenid(String openid);
}