<?php

namespace MediaConchOnlineBundle\Tests\Controller;

class XslPolicyControllerTest extends AbstractAuthControllerTest
{
    public function testOldPolicy()
    {
        $this->client->request('GET', '/MediaConchOnline/xslPolicyTree/');

        $this->assertEquals(301, $this->client->getResponse()->getStatusCode());
    }

    public function testPolicy()
    {
        $crawler = $this->client->request('GET', '/MediaConchOnline/policyEditor');

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertCount(1, $crawler->filter('h1:contains("Policy editor")'));
    }

    public function testPublicPolicies()
    {
        $crawler = $this->client->request('GET', '/MediaConchOnline/publicPolicies');

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertCount(1, $crawler->filter('h1:contains("Public policies")'));
    }
}
